"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

export function UpgradeSuccessBanner() {
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (upgraded === "true") {
      setVisible(true);
      // Clean up URL
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [upgraded]);

  if (!visible) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in duration-500">
      <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
      <div className="flex-1">
        <p className="font-semibold text-green-800">Subscription activated!</p>
        <p className="text-sm text-green-600">Your listing has been upgraded. Changes are live now.</p>
      </div>
      <button onClick={() => setVisible(false)} className="text-green-400 hover:text-green-600">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
