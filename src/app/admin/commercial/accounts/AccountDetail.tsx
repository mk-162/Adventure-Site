"use client";

import { useState, useTransition } from "react";
import {
  Building2, Edit, Trash2, Eye, CreditCard, StickyNote,
  ChevronDown, ChevronUp, Link2, Unlink, Save, X
} from "lucide-react";
import Link from "next/link";
import { updateAccount, deleteAccount, linkOperatorToAccount, updateOperatorBilling } from "./actions";

interface AccountData {
  id: number;
  name: string;
  slug: string;
  primaryEmail: string | null;
  contactName: string | null;
  billingEmail: string | null;
  billingCustomAmount: string | null;
  billingNotes: string | null;
  adminNotes: string | null;
  primaryPhone: string | null;
  createdAt: Date;
}

interface OperatorData {
  id: number;
  name: string;
  slug: string;
  accountId: number | null;
  claimStatus: string;
  billingTier: string | null;
  billingCustomAmount: string | null;
  billingNotes: string | null;
  adminNotes: string | null;
  stripeSubscriptionStatus: string | null;
  billingPeriodEnd: Date | null;
}

export function AccountDetail({ account, linkedOperators, unlinkedOperators }: {
  account: AccountData;
  linkedOperators: OperatorData[];
  unlinkedOperators: OperatorData[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingOpId, setEditingOpId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleLink(operatorId: number) {
    startTransition(async () => {
      await linkOperatorToAccount(operatorId, account.id);
    });
  }

  function handleUnlink(operatorId: number) {
    startTransition(async () => {
      await linkOperatorToAccount(operatorId, null);
    });
  }

  function handleDelete() {
    if (!confirm(`Delete account "${account.name}"? Operators will be unlinked but not deleted.`)) return;
    startTransition(async () => {
      await deleteAccount(account.id);
    });
  }

  const paymentBadge = (op: OperatorData) => {
    const status = op.stripeSubscriptionStatus;
    if (!status) return <span className="text-xs text-gray-400">No sub</span>;
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      trialing: "bg-blue-100 text-blue-700",
      past_due: "bg-red-100 text-red-700",
      canceled: "bg-gray-100 text-gray-600",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="bg-[#1e3a4c] w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold">
            {account.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{account.name}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {account.contactName && <span>{account.contactName}</span>}
              {account.primaryEmail && <span>{account.primaryEmail}</span>}
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {linkedOperators.length} site{linkedOperators.length !== 1 ? "s" : ""}
              </span>
              {account.billingCustomAmount && (
                <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                  £{account.billingCustomAmount}/mo
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {account.adminNotes && <span title={account.adminNotes}><StickyNote className="h-4 w-4 text-yellow-500" /></span>}
          {account.billingNotes && <span title={account.billingNotes}><CreditCard className="h-4 w-4 text-green-500" /></span>}
          {expanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-6 space-y-6">
          {/* Account Edit Form */}
          {editing ? (
            <form action={async (formData: FormData) => {
              startTransition(async () => {
                await updateAccount(account.id, formData);
                setEditing(false);
              });
            }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Company Name</label>
                  <input name="name" defaultValue={account.name} required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Contact Name</label>
                  <input name="contactName" defaultValue={account.contactName || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input name="primaryEmail" type="email" defaultValue={account.primaryEmail || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                  <input name="primaryPhone" defaultValue={account.primaryPhone || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Billing Email</label>
                  <input name="billingEmail" type="email" defaultValue={account.billingEmail || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Custom £/mo</label>
                  <input name="billingCustomAmount" type="number" step="0.01" defaultValue={account.billingCustomAmount || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Billing Notes</label>
                  <input name="billingNotes" defaultValue={account.billingNotes || ""} placeholder="e.g. 20% discount for 3+ sites"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Admin Notes</label>
                  <textarea name="adminNotes" defaultValue={account.adminNotes || ""} rows={3} placeholder="Internal notes..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={isPending}
                  className="px-4 py-2 bg-[#f97316] text-white rounded-lg text-sm font-medium hover:bg-[#ea580c] disabled:opacity-50">
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-start justify-between">
              <div className="space-y-2 text-sm">
                {account.billingNotes && (
                  <div className="flex items-start gap-2">
                    <CreditCard className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-gray-600">{account.billingNotes}</span>
                  </div>
                )}
                {account.adminNotes && (
                  <div className="flex items-start gap-2">
                    <StickyNote className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span className="text-gray-600">{account.adminNotes}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setEditing(true)}
                  className="p-2 text-gray-400 hover:text-[#f97316] rounded-lg hover:bg-orange-50" title="Edit account">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50" title="Delete account">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Linked Sites */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Linked Sites</h4>
            {linkedOperators.length === 0 ? (
              <p className="text-sm text-gray-400">No sites linked yet. Link operators below.</p>
            ) : (
              <div className="space-y-2">
                {linkedOperators.map((op) => (
                  <div key={op.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Link href={`/directory/${op.slug}`} className="font-medium text-sm text-gray-900 hover:text-[#f97316]">
                        {op.name}
                      </Link>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        op.claimStatus === "premium" ? "bg-amber-100 text-amber-700" :
                        op.claimStatus === "claimed" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {op.billingTier || "free"}
                      </span>
                      {paymentBadge(op)}
                      {op.billingCustomAmount && (
                        <span className="text-xs text-green-600">£{op.billingCustomAmount}/mo</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {editingOpId === op.id ? (
                        <form action={async (formData: FormData) => {
                          startTransition(async () => {
                            await updateOperatorBilling(op.id, formData);
                            setEditingOpId(null);
                          });
                        }} className="flex items-center gap-2">
                          <input name="billingCustomAmount" type="number" step="0.01" defaultValue={op.billingCustomAmount || ""}
                            placeholder="£/mo" className="w-20 px-2 py-1 text-xs border border-gray-200 rounded" />
                          <input name="billingNotes" defaultValue={op.billingNotes || ""}
                            placeholder="Notes" className="w-40 px-2 py-1 text-xs border border-gray-200 rounded" />
                          <input name="adminNotes" defaultValue={op.adminNotes || ""}
                            placeholder="Admin notes" className="w-40 px-2 py-1 text-xs border border-gray-200 rounded" />
                          <button type="submit" disabled={isPending}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Save className="h-3 w-3" /></button>
                          <button type="button" onClick={() => setEditingOpId(null)}
                            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"><X className="h-3 w-3" /></button>
                        </form>
                      ) : (
                        <>
                          {op.billingNotes && (
                            <span className="text-xs text-gray-400 mr-2" title={op.billingNotes}>
                              <CreditCard className="h-3 w-3 inline text-green-400" /> {op.billingNotes.slice(0, 30)}{op.billingNotes.length > 30 ? "…" : ""}
                            </span>
                          )}
                          <button onClick={() => setEditingOpId(op.id)}
                            className="p-1.5 text-gray-400 hover:text-[#f97316] rounded hover:bg-orange-50" title="Edit billing">
                            <Edit className="h-3 w-3" />
                          </button>
                          <button onClick={() => handleUnlink(op.id)} disabled={isPending}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-red-50" title="Unlink from account">
                            <Unlink className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Link unlinked operators */}
          {unlinkedOperators.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Link a Site</h4>
              <div className="flex flex-wrap gap-2">
                {unlinkedOperators.map((op) => (
                  <button
                    key={op.id}
                    onClick={() => handleLink(op.id)}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:border-[#f97316] hover:text-[#f97316] transition-colors disabled:opacity-50"
                  >
                    <Link2 className="h-3 w-3" />
                    {op.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
