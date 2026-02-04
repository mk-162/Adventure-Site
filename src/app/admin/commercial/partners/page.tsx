"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Handshake,
  Search,
  Edit,
  Check,
  X,
  ChevronDown,
  Zap,
  Globe,
  Building2,
  Filter,
} from "lucide-react";
import {
  getPartnersData,
  updateOperatorBooking,
  bulkUpdateBookingPlatform,
} from "./actions";

type BookingPlatform = "none" | "beyonk" | "rezdy" | "fareharbor" | "direct";

interface OperatorRow {
  id: number;
  name: string;
  slug: string;
  category: string | null;
  claimStatus: string;
  bookingPlatform: BookingPlatform;
  bookingPartnerRef: string | null;
  bookingAffiliateId: string | null;
  bookingWidgetUrl: string | null;
}

interface Stats {
  beyonk: number;
  rezdy: number;
  fareharbor: number;
  direct: number;
  none: number;
  total: number;
}

const platformColors: Record<BookingPlatform, string> = {
  none: "bg-gray-100 text-gray-600",
  beyonk: "bg-purple-100 text-purple-700",
  rezdy: "bg-blue-100 text-blue-700",
  fareharbor: "bg-teal-100 text-teal-700",
  direct: "bg-emerald-100 text-emerald-700",
};

const platformLabels: Record<BookingPlatform, string> = {
  none: "Not Mapped",
  beyonk: "Beyonk",
  rezdy: "Rezdy",
  fareharbor: "FareHarbor",
  direct: "Direct",
};

export default function PartnersPage() {
  const [operators, setOperators] = useState<OperatorRow[]>([]);
  const [stats, setStats] = useState<Stats>({
    beyonk: 0, rezdy: 0, fareharbor: 0, direct: 0, none: 0, total: 0,
  });
  const [filter, setFilter] = useState<BookingPlatform | "all">("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    bookingPlatform: BookingPlatform;
    bookingPartnerRef: string;
    bookingAffiliateId: string;
    bookingWidgetUrl: string;
  }>({ bookingPlatform: "none", bookingPartnerRef: "", bookingAffiliateId: "", bookingWidgetUrl: "" });
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkPlatform, setBulkPlatform] = useState<BookingPlatform>("none");
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getPartnersData();
      setOperators(data.operators);
      setStats(data.stats);
    } catch (e) {
      console.error("Failed to load partners data", e);
    }
    setLoading(false);
  }

  function startEdit(op: OperatorRow) {
    setEditingId(op.id);
    setEditForm({
      bookingPlatform: op.bookingPlatform,
      bookingPartnerRef: op.bookingPartnerRef || "",
      bookingAffiliateId: op.bookingAffiliateId || "",
      bookingWidgetUrl: op.bookingWidgetUrl || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: number) {
    startTransition(async () => {
      await updateOperatorBooking(id, editForm);
      setEditingId(null);
      await loadData();
    });
  }

  async function handleBulkUpdate() {
    if (selected.size === 0) return;
    startTransition(async () => {
      await bulkUpdateBookingPlatform(Array.from(selected), bulkPlatform);
      setSelected(new Set());
      await loadData();
    });
  }

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((o) => o.id)));
    }
  }

  const filtered = operators.filter((op) => {
    if (filter !== "all" && op.bookingPlatform !== filter) return false;
    if (search && !op.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-[#f97316] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Mapping</h1>
          <p className="text-gray-500">
            Map operators to booking platforms for affiliate tracking
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Beyonk" count={stats.beyonk} color="bg-purple-500" />
        <StatCard label="Rezdy" count={stats.rezdy} color="bg-blue-500" />
        <StatCard label="FareHarbor" count={stats.fareharbor} color="bg-teal-500" />
        <StatCard label="Direct" count={stats.direct} color="bg-emerald-500" />
        <StatCard label="Not Mapped" count={stats.none} color="bg-gray-400" />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search operators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as BookingPlatform | "all")}
            className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#f97316] focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Platforms</option>
            <option value="none">Not Mapped</option>
            <option value="beyonk">Beyonk</option>
            <option value="rezdy">Rezdy</option>
            <option value="fareharbor">FareHarbor</option>
            <option value="direct">Direct</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-[#f97316]/5 border border-[#f97316]/20 rounded-lg">
          <span className="text-sm font-medium text-[#1e3a4c]">
            {selected.size} selected
          </span>
          <span className="text-gray-300">|</span>
          <label className="text-sm text-gray-600">Set platform:</label>
          <select
            value={bulkPlatform}
            onChange={(e) => setBulkPlatform(e.target.value as BookingPlatform)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
          >
            <option value="none">Not Mapped</option>
            <option value="beyonk">Beyonk</option>
            <option value="rezdy">Rezdy</option>
            <option value="fareharbor">FareHarbor</option>
            <option value="direct">Direct</option>
          </select>
          <button
            onClick={handleBulkUpdate}
            disabled={isPending}
            className="px-4 py-1.5 bg-[#f97316] text-white text-sm font-medium rounded-lg hover:bg-[#ea580c] disabled:opacity-50 transition-colors"
          >
            {isPending ? "Updating..." : "Apply"}
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-[#f97316] focus:ring-[#f97316]"
                  />
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                  Operator
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                  Claim Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                  Booking Platform
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                  Partner Ref
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((op) => (
                <tr key={op.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(op.id)}
                      onChange={() => toggleSelect(op.id)}
                      className="rounded border-gray-300 text-[#f97316] focus:ring-[#f97316]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#1e3a4c] w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {op.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{op.name}</p>
                        <p className="text-xs text-gray-400">/{op.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {op.category ? op.category.replace(/_/g, " ") : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        op.claimStatus === "premium"
                          ? "bg-amber-100 text-amber-700"
                          : op.claimStatus === "claimed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {op.claimStatus}
                    </span>
                  </td>

                  {editingId === op.id ? (
                    <>
                      <td className="px-4 py-3" colSpan={2}>
                        <div className="space-y-2">
                          <select
                            value={editForm.bookingPlatform}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                bookingPlatform: e.target.value as BookingPlatform,
                              }))
                            }
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
                          >
                            <option value="none">None</option>
                            <option value="beyonk">Beyonk</option>
                            <option value="rezdy">Rezdy</option>
                            <option value="fareharbor">FareHarbor</option>
                            <option value="direct">Direct</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Partner Ref (e.g. supplier ID)"
                            value={editForm.bookingPartnerRef}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                bookingPartnerRef: e.target.value,
                              }))
                            }
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Affiliate ID"
                            value={editForm.bookingAffiliateId}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                bookingAffiliateId: e.target.value,
                              }))
                            }
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Widget URL"
                            value={editForm.bookingWidgetUrl}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                bookingWidgetUrl: e.target.value,
                              }))
                            }
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => saveEdit(op.id)}
                            disabled={isPending}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-50"
                            title="Save"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            platformColors[op.bookingPlatform]
                          }`}
                        >
                          {platformLabels[op.bookingPlatform]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500 font-mono">
                          {op.bookingPartnerRef || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => startEdit(op)}
                          className="p-2 text-gray-400 hover:text-[#f97316] rounded-lg hover:bg-orange-50 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Handshake className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p>No operators match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <span className="text-2xl font-bold text-[#1e3a4c]">{count}</span>
    </div>
  );
}
