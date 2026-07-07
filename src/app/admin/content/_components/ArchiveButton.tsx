"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

/**
 * Shared "delete" button for admin content list pages. Content is never
 * hard-deleted from these lists — it's soft-archived (status set to
 * 'archived') so it disappears from the public site but can be restored.
 * Requires a confirm step before calling the bound server action.
 */
export function ArchiveButton({
  action,
  itemName,
  itemLabel = "item",
}: {
  action: () => Promise<void>;
  itemName: string;
  itemLabel?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (
      !confirm(
        `Archive "${itemName}"? This ${itemLabel} will be hidden from the public site but not permanently deleted.`
      )
    ) {
      return;
    }
    startTransition(() => {
      action();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
      title="Archive"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
