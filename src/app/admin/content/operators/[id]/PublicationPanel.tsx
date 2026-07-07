"use client";

import { useState, useTransition } from "react";
import { ExternalLink } from "lucide-react";
import { setOperatorStatus } from "../actions";

type Status = "draft" | "review" | "published" | "archived";

const STATUS_LABELS: Record<Status, string> = {
  draft: "Draft",
  review: "In Review",
  published: "Published",
  archived: "Archived",
};

const STATUS_COLORS: Record<Status, string> = {
  draft: "bg-gray-100 text-gray-800",
  review: "bg-yellow-100 text-yellow-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-red-100 text-red-800",
};

/**
 * Dedicated publish/unpublish control. This is the ONLY place operator
 * status is changed from the admin UI, and it calls a server action that
 * touches nothing but the status column (see operators/actions.ts).
 * Publishing is what makes the operator publicly visible — say so plainly
 * so nobody publishes a listing that hasn't been verified.
 */
export default function PublicationPanel({
  operatorId,
  slug,
  status,
}: {
  operatorId: number;
  slug: string;
  status: Status;
}) {
  const [pendingAction, setPendingAction] = useState<Status | null>(null);
  const [isPending, startTransition] = useTransition();

  function confirmChange() {
    if (!pendingAction) return;
    const next = pendingAction;
    startTransition(async () => {
      await setOperatorStatus(operatorId, next);
      setPendingAction(null);
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-amber-300 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Publication</h2>
      <p className="text-sm text-gray-500 mb-4">
        Controls whether this operator is publicly visible. This is separate from the
        details form below — changing publication status never saves other edits, and
        saving the form below never changes publication status.
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-sm text-gray-600">Current status:</span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
        {status === "published" && (
          <a
            href={`/directory/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-accent-hover hover:underline"
          >
            View live listing <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {status === "published" ? (
        <p className="text-sm text-gray-600 mb-4">
          This operator is live at{" "}
          <code className="bg-gray-100 px-1 rounded">/directory/{slug}</code>.
        </p>
      ) : (
        <p className="text-sm text-gray-600 mb-4">
          This operator is <strong>not</strong> publicly visible. Publishing will make it
          appear immediately at{" "}
          <code className="bg-gray-100 px-1 rounded">/directory/{slug}</code>.
        </p>
      )}

      {pendingAction ? (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800 flex-1 min-w-[200px]">
            {pendingAction === "published"
              ? `Confirm: make this operator publicly visible at /directory/${slug} right now?`
              : pendingAction === "archived"
              ? "Confirm: archive this operator? It will be hidden from the public site immediately."
              : `Confirm: set status to "${STATUS_LABELS[pendingAction]}"?`}
          </p>
          <button
            type="button"
            onClick={confirmChange}
            disabled={isPending}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {isPending ? "Saving…" : "Yes, confirm"}
          </button>
          <button
            type="button"
            onClick={() => setPendingAction(null)}
            disabled={isPending}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {status !== "published" && (
            <button
              type="button"
              onClick={() => setPendingAction("published")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Publish
            </button>
          )}
          {status === "published" && (
            <button
              type="button"
              onClick={() => setPendingAction("draft")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Unpublish (back to Draft)
            </button>
          )}
          {status === "archived" ? (
            <button
              type="button"
              onClick={() => setPendingAction("draft")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Restore to Draft
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPendingAction("archived")}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
              Archive
            </button>
          )}
        </div>
      )}
    </div>
  );
}
