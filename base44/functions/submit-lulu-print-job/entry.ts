import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";
import {
  getLuluToken,
  calculateCoverDimensions,
  createPrintJob,
  countryToCode,
  POD_PACKAGE_ID,
} from "../../shared/lulu.ts";
import { generateInteriorPdf, generateCoverPdf } from "../../shared/bookPdf.ts";

/**
 * Submits a confirmed (paid) book order to Lulu Direct for print-on-demand
 * fulfillment: generates print-ready interior + cover PDFs, uploads them to
 * public storage, creates a Lulu print job, and records the job id on the book.
 *
 * Triggered automatically by the "Auto Print Orders" workflow whenever a Book's
 * status flips to "ordered". Can also be invoked directly with { book_id }.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const bookId = body.book_id || body.bookId;
    if (!bookId) {
      return Response.json({ error: "book_id required" }, { status: 400 });
    }

    const book = await base44.asServiceRole.entities.Book.get(bookId);
    if (!book) {
      return Response.json({ error: "book not found" }, { status: 404 });
    }
    // Don't re-submit an order already in the print pipeline.
    if (book.lulu_job_id || ["printing", "shipped", "delivered"].includes(book.print_status)) {
      return Response.json({ ok: true, message: "already submitted", lulu_job_id: book.lulu_job_id, print_status: book.print_status });
    }

    const clientKey = Deno.env.get("LULU_CLIENT_KEY");
    const clientSecret = Deno.env.get("LULU_CLIENT_SECRET");
    if (!clientKey || !clientSecret) {
      console.error("submit-lulu-print-job: LULU_CLIENT_KEY / LULU_CLIENT_SECRET not set");
      return Response.json({ error: "Lulu credentials not configured" }, { status: 500 });
    }

    // 1. Authenticate with Lulu.
    const token = await getLuluToken(clientKey, clientSecret);

    // 2. Generate print-ready PDFs.
    const { bytes: interiorBytes, pageCount } = await generateInteriorPdf(book);
    const dims = await calculateCoverDimensions(token, POD_PACKAGE_ID, pageCount);
    const coverBytes = await generateCoverPdf(book, dims.width, dims.height);

    // 3. Upload both PDFs to public storage so Lulu can fetch them.
    const interiorFile = new File([interiorBytes], "interior.pdf", { type: "application/pdf" });
    const coverFile = new File([coverBytes], "cover.pdf", { type: "application/pdf" });
    const interiorUp = await base44.asServiceRole.integrations.Core.UploadFile({ file: interiorFile });
    const coverUp = await base44.asServiceRole.integrations.Core.UploadFile({ file: coverFile });
    const interiorUrl = interiorUp?.file_url;
    const coverUrl = coverUp?.file_url;
    if (!interiorUrl || !coverUrl) {
      throw new Error("File upload did not return public URLs");
    }

    // 4. Create the Lulu print job.
    const job = await createPrintJob(token, {
      externalId: book.id,
      title: book.book_title || "Print A Story",
      podPackageId: POD_PACKAGE_ID,
      interiorUrl,
      coverUrl,
      recipientName: book.recipient_name || "Customer",
      address: parseAddress(book.shipping_address || ""),
    });

    // 5. Record the job id and advance print status.
    await base44.asServiceRole.entities.Book.update(bookId, {
      print_status: "printing",
      lulu_job_id: String(job.id),
    });

    return Response.json({ ok: true, job_id: job.id, print_status: "printing" });
  } catch (error) {
    console.error("submit-lulu-print-job error:", error?.message || error);
    return Response.json({ error: error?.message || "Lulu submission failed" }, { status: 500 });
  }
});

/**
 * Parse the shipping_address string stored on the book into Lulu address fields.
 * Current checkout format: "street, city, state, zip, country, phone"
 * Legacy format (no state/phone): "street, city, zip, country"
 */
function parseAddress(s) {
  const parts = s.split(/,\s*/).map((x) => x.trim()).filter(Boolean);
  const addr = {
    street1: "",
    city: "",
    state_code: "",
    postcode: "",
    country_code: "US",
    phone_number: "0000000000",
    email: "noreply@print-a-story.com",
  };
  if (parts.length >= 6) {
    [addr.street1, addr.city, addr.state_code, addr.postcode, addr.country_code, addr.phone_number] = parts;
  } else if (parts.length >= 4) {
    [addr.street1, addr.city, addr.postcode, addr.country_code] = parts;
  } else if (parts.length >= 1) {
    addr.street1 = parts[0];
  }
  addr.country_code = countryToCode(addr.country_code);
  if (!addr.phone_number) addr.phone_number = "0000000000";
  return addr;
}