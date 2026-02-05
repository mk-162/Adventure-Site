"use client";

import { useState } from "react";
import { Loader2, Download } from "lucide-react";
import { ingestEvents } from "./actions";

export function ImportButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleImport = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await ingestEvents();
      setMessage(`Imported: ${data.imported}, Skipped: ${data.skipped}`);
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`Error: ${err.message}`);
      } else {
        setMessage("Failed to import");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
        <button
            onClick={handleImport}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Import from EventBrite
        </button>
        {message && <span className="text-sm text-gray-600">{message}</span>}
    </div>
  );
}
