// Generate print-ready PDFs (interior + one-piece cover) for a Book record
// using pdf-lib with an embedded TTF font (Ubuntu) so the files satisfy Lulu's
// "fonts must be embedded" validation rule.

import { PDFDocument, rgb } from "npm:pdf-lib@1.17.1";

// pdf-lib's own hosted Ubuntu Regular TTF — stable, CORS-enabled, embeddable.
const FONT_URL =
  "https://pdf-lib.s3-us-west-2.amazonaws.com/assets/ubuntu/Ubuntu-R.ttf";

// 6"x9" trim in points (1in = 72pt).
const TRIM_W = 432;
const TRIM_H = 648;
const MARGIN_X = 54;
const MARGIN_TOP = 72;
const MARGIN_BOTTOM = 72;
const CONTENT_W = TRIM_W - MARGIN_X * 2;
const LINE_H = 16;
const BODY = 11;
const CHAPTER = 16;
const TITLE = 24;
const SMALL = 10;

const BLACK = rgb(0.12, 0.12, 0.12);
const GREY = rgb(0.45, 0.45, 0.45);
const ACCENT = rgb(0.78, 0.30, 0.30);

let cachedFontBytes = null;
async function loadFontBytes() {
  if (cachedFontBytes) return cachedFontBytes;
  const r = await fetch(FONT_URL);
  if (!r.ok) throw new Error(`Could not load book font (${r.status})`);
  cachedFontBytes = await r.arrayBuffer();
  return cachedFontBytes;
}

/** Keep only ASCII printable chars + newlines; normalise smart punctuation. */
function sanitize(s) {
  if (s == null) return "";
  return String(s)
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "--")
    .replace(/\u2026/g, "...")
    .replace(/[^\x20-\x7E\n]/g, "");
}

function wrap(text, font, size, maxWidth) {
  const out = [];
  for (const paragraph of String(text).split(/\n+/)) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (!words.length) { out.push(""); continue; }
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        out.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

function drawCentered(page, font, text, size, centerX, y, maxWidth, color) {
  let yy = y;
  for (const line of wrap(sanitize(text), font, size, maxWidth)) {
    const w = font.widthOfTextAtSize(line, size);
    page.drawText(line, { x: centerX - w / 2, y: yy, font, size, color });
    yy -= size + 4;
  }
  return yy;
}

function drawPageNumber(page, font, n) {
  const txt = String(n);
  const w = font.widthOfTextAtSize(txt, SMALL);
  page.drawText(txt, {
    x: TRIM_W / 2 - w / 2,
    y: 40,
    font,
    size: SMALL,
    color: GREY,
  });
}

/**
 * Build the interior PDF. Returns { bytes: Uint8Array, pageCount }.
 * @param {object} book
 */
export async function generateInteriorPdf(book) {
  const fontBytes = await loadFontBytes();
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(fontBytes, { subset: true });
  let pageNum = 0;

  const newPage = () => {
    const p = doc.addPage([TRIM_W, TRIM_H]);
    pageNum += 1;
    return p;
  };

  // --- Title page (no page number) ---
  const cover = doc.addPage([TRIM_W, TRIM_H]);
  drawCentered(cover, font, "A Print A Story Original", SMALL, TRIM_W / 2, TRIM_H - MARGIN_TOP - 10, CONTENT_W, ACCENT);
  drawCentered(cover, font, book.book_title || "Your Story", TITLE, TRIM_W / 2, TRIM_H / 2 + 20, CONTENT_W, BLACK);
  drawCentered(cover, font, `For ${book.recipient_name || "Someone Special"}`, BODY, TRIM_W / 2, TRIM_H / 2 - 60, CONTENT_W, GREY);
  drawCentered(cover, font, `Written with love by ${book.author_name || "A Friend"}`, SMALL, TRIM_W / 2, TRIM_H / 2 - 90, CONTENT_W, GREY);

  // --- Dedication ---
  if (book.dedication && book.dedication.trim()) {
    const p = newPage();
    drawCentered(p, font, book.dedication, BODY + 1, TRIM_W / 2, TRIM_H - MARGIN_TOP - 120, CONTENT_W - 40, BLACK);
    drawPageNumber(p, font, pageNum);
  }

  // --- Chapters ---
  const chapters = Array.isArray(book.chapters) ? book.chapters : [];
  for (const ch of chapters) {
    let p = newPage();
    let y = TRIM_H - MARGIN_TOP;
    drawCentered(p, font, ch.chapterTitle || "", CHAPTER, TRIM_W / 2, y, CONTENT_W, ACCENT);
    y -= CHAPTER + 24;

    for (const line of wrap(ch.content, font, BODY, CONTENT_W)) {
      if (y < MARGIN_BOTTOM + 30) {
        drawPageNumber(p, font, pageNum);
        p = newPage();
        y = TRIM_H - MARGIN_TOP;
      }
      p.drawText(line, { x: MARGIN_X, y, font, size: BODY, color: BLACK });
      y -= LINE_H;
    }

    if (ch.footerJoke && ch.footerJoke.trim()) {
      y -= 10;
      for (const line of wrap(ch.footerJoke, font, BODY - 1, CONTENT_W - 20)) {
        if (y < MARGIN_BOTTOM + 30) {
          drawPageNumber(p, font, pageNum);
          p = newPage();
          y = TRIM_H - MARGIN_TOP;
        }
        const w = font.widthOfTextAtSize(line, BODY - 1);
        p.drawText(line, { x: TRIM_W - MARGIN_X - w, y, font, size: BODY - 1, color: GREY });
        y -= LINE_H;
      }
    }
    drawPageNumber(p, font, pageNum);
  }

  // Ensure Lulu's 2-page minimum.
  if (doc.getPageCount() < 2) {
    const p = doc.addPage([TRIM_W, TRIM_H]);
    drawCentered(p, font, "The End", BODY, TRIM_W / 2, TRIM_H / 2, CONTENT_W, GREY);
  }

  const bytes = await doc.save();
  return { bytes, pageCount: doc.getPageCount() };
}

/** Build a one-piece cover PDF sized exactly to Lulu's calculated dimensions. */
export async function generateCoverPdf(book, widthPt, heightPt) {
  const fontBytes = await loadFontBytes();
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(fontBytes, { subset: true });
  const page = doc.addPage([widthPt, heightPt]);

  page.drawRectangle({ x: 0, y: 0, width: widthPt, height: heightPt, color: rgb(0.12, 0.10, 0.09) });

  // Front cover sits in the right portion of the one-piece spread.
  const frontCenterX = widthPt * 0.72;
  const frontCenterY = heightPt / 2;
  const frontMaxW = widthPt * 0.26;

  drawCentered(page, font, "Print A Story", SMALL, frontCenterX, frontCenterY + 90, frontMaxW, ACCENT);
  drawCentered(page, font, book.book_title || "Your Story", TITLE - 4, frontCenterX, frontCenterY + 20, frontMaxW, rgb(0.98, 0.96, 0.92));
  drawCentered(page, font, `For ${book.recipient_name || "You"}`, BODY, frontCenterX, frontCenterY - 50, frontMaxW, rgb(0.78, 0.74, 0.68));
  drawCentered(page, font, `by ${book.author_name || "A Friend"}`, SMALL, frontCenterX, frontCenterY - 80, frontMaxW, rgb(0.6, 0.56, 0.52));

  return await doc.save();
}