import { redirect } from "next/navigation";

// /my-adventures is the canonical account page (this was a stale duplicate
// with broken saved-item links and a broken sign-out).
export default function AccountPage() {
  redirect("/my-adventures");
}
