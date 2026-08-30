import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, BookOpen, Search, Calendar, Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isWithinInterval, startOfDay, endOfDay, subDays, parseISO } from "date-fns";

const PRINT_STATUSES = ["pending", "received", "printing", "shipped", "delivered"];

const statusStyle = {
  pending: "bg-stone-100 text-stone-600",
  received: "bg-blue-100 text-blue-700",
  printing: "bg-amber-100 text-amber-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
};

const RANGES = [
  { label: "All time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

export default function CompanionOrders() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const list = await base44.entities.Book.list("-created_date", 500);
      setBooks(Array.isArray(list) ? list : []);
    } catch (e) {
      setBooks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      if (statusFilter !== "all" && (b.print_status || "pending") !== statusFilter) return false;

      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = [b.book_title, b.recipient_name, b.author_name].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (!b.created_date) return range === "all" && !from && !to;
      const d = typeof b.created_date === "string" ? parseISO(b.created_date) : new Date(b.created_date);

      if (range === "today") {
        return isWithinInterval(d, { start: startOfDay(new Date()), end: endOfDay(new Date()) });
      }
      if (range === "7d") {
        return isWithinInterval(d, { start: subDays(startOfDay(new Date()), 6), end: endOfDay(new Date()) });
      }
      if (range === "30d") {
        return isWithinInterval(d, { start: subDays(startOfDay(new Date()), 29), end: endOfDay(new Date()) });
      }
      if (range === "custom") {
        const start = from ? startOfDay(parseISO(from)) : null;
        const endF = to ? endOfDay(parseISO(to)) : null;
        if (start && d < start) return false;
        if (endF && d > endF) return false;
      }
      return true;
    });
  }, [books, range, from, to, query, statusFilter]);

  const updatePrintStatus = async (book, newStatus) => {
    setBooks((prev) => prev.map((b) => (b.id === book.id ? { ...b, print_status: newStatus } : b)));
    try {
      await base44.entities.Book.update(book.id, { print_status: newStatus });
    } catch (e) {
      load();
    }
  };

  const counts = useMemo(() => {
    const c = { pending: 0, received: 0, printing: 0, shipped: 0, delivered: 0 };
    books.forEach((b) => { c[b.print_status || "pending"]++; });
    return c;
  }, [books]);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link to="/companion" className="inline-flex items-center text-sm text-stone-400 hover:text-stone-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Companion Home
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-2">
              <Package className="w-7 h-7 text-stone-900" /> Order Management
              <span className="text-xs uppercase tracking-widest text-amber-700 font-medium align-middle">Companion</span>
            </h1>
            <p className="text-stone-500 mt-1">All requested books and their print status.</p>
          </div>
          <Button variant="outline" onClick={load} className="rounded-full">Refresh</Button>
        </div>

        {/* Status summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {PRINT_STATUSES.map((s) => (
            <div key={s} className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-xs uppercase tracking-wide text-stone-400 capitalize">{s}</div>
              <div className="font-display text-2xl font-bold mt-1">{counts[s]}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-medium text-stone-500 flex items-center gap-1 mr-1">
              <Calendar className="w-4 h-4" /> Order date:
            </div>
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={[
                  "px-3 py-1.5 rounded-full text-sm transition-colors border",
                  range === r.value ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-400",
                ].join(" ")}
              >
                {r.label}
              </button>
            ))}
            <button
              onClick={() => setRange("custom")}
              className={[
                "px-3 py-1.5 rounded-full text-sm transition-colors border",
                range === "custom" ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-400",
              ].join(" ")}
            >
              Custom range
            </button>
          </div>

          {range === "custom" && (
            <div className="flex flex-wrap items-center gap-2">
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-auto rounded-xl h-10" />
              <span className="text-stone-400">to</span>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-auto rounded-xl h-10" />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, recipient, or author..."
                className="rounded-xl pl-9 h-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] rounded-xl h-10">
                <SelectValue placeholder="Print status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {PRINT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-sm text-stone-500 mb-3">{filtered.length} order{filtered.length === 1 ? "" : "s"}</div>

        {/* List */}
        {loading ? (
          <div className="py-20 text-center text-stone-400">Loading orders…</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 py-20 text-center">
            <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500">No orders match your filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={["text-xs font-medium px-2 py-0.5 rounded-full capitalize", statusStyle[b.print_status || "pending"]].join(" ")}>
                      {b.print_status || "pending"}
                    </span>
                    <span className="text-xs text-stone-400">{b.status}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-stone-900 truncate">
                    {b.book_title || "Untitled book"}
                  </h3>
                  <div className="text-sm text-stone-500">
                    For <span className="text-stone-700 font-medium">{b.recipient_name}</span> · from {b.author_name} · {b.relationship}
                  </div>
                  <div className="text-xs text-stone-400 mt-1">
                    Ordered {b.created_date ? format(new Date(b.created_date), "MMM d, yyyy 'at' h:mm a") : "—"}
                  </div>
                </div>

                <div className="md:w-56 flex items-center gap-2">
                  <label className="text-xs text-stone-400 whitespace-nowrap">Print status:</label>
                  <Select value={b.print_status || "pending"} onValueChange={(v) => updatePrintStatus(b, v)}>
                    <SelectTrigger className="rounded-xl h-9 capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRINT_STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}