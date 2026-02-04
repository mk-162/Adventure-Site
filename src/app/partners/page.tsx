import { redirect } from "next/navigation";

export default function PartnersPage() {
  redirect("/advertise");
}

export const metadata = {
  title: "List Your Adventure Business | Adventure Wales",
  description:
    "Join Welsh adventure operators already listed on Adventure Wales. Get discovered by thousands of adventure-seekers.",
};
