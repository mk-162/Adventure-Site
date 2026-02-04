"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function MyAdventuresClient() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/user/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-red-600 border border-slate-200 rounded-lg hover:border-red-200 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Sign out
    </button>
  );
}
