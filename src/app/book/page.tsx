import { redirect } from "next/navigation";

// Redirect /book to /trip-planner
export default function BookPage() {
  redirect("/trip-planner");
}
