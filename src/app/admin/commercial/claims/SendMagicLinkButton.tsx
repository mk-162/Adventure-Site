"use client";

import { useState, useTransition } from "react";
import { Mail, Check, AlertCircle } from "lucide-react";
import { sendAdminMagicLink } from "./actions";

export function SendMagicLinkButton({ operatorId, email }: { operatorId: number; email: string }) {
  const [showInput, setShowInput] = useState(false);
  const [targetEmail, setTargetEmail] = useState(email);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSend() {
    if (!targetEmail || !targetEmail.includes("@")) {
      setError("Enter a valid email");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await sendAdminMagicLink(operatorId, targetEmail);
        setSent(true);
        setTimeout(() => {
          setSent(false);
          setShowInput(false);
        }, 3000);
      } catch (e: any) {
        setError(e.message || "Failed to send");
      }
    });
  }

  if (sent) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1.5 text-xs text-green-600">
        <Check className="h-3 w-3" /> Sent!
      </span>
    );
  }

  if (showInput) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="email"
          value={targetEmail}
          onChange={(e) => setTargetEmail(e.target.value)}
          placeholder="email@example.com"
          className="w-48 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#f97316] focus:border-transparent"
          autoFocus
        />
        <button
          onClick={handleSend}
          disabled={isPending}
          className="px-2 py-1.5 text-xs font-medium text-white bg-[#f97316] rounded-lg hover:bg-[#ea580c] disabled:opacity-50"
        >
          {isPending ? "..." : "Send"}
        </button>
        <button
          onClick={() => { setShowInput(false); setError(null); }}
          className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
        {error && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowInput(true)}
      className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50"
      title="Send magic link"
    >
      <Mail className="h-4 w-4" />
    </button>
  );
}
