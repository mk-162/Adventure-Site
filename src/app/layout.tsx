import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Adventure Wales | Your Welsh Adventure Starts Here",
  description: "Discover the wildest corners of Wales, from Snowdonia's misty peaks to Pembrokeshire's rugged coast. Plan unforgettable outdoor experiences across Wales.",
  keywords: "Wales, adventure, outdoor activities, Snowdonia, Pembrokeshire, hiking, coasteering, surfing, mountain biking",
  openGraph: {
    title: "Adventure Wales | Your Welsh Adventure Starts Here",
    description: "Discover the wildest corners of Wales, from Snowdonia's misty peaks to Pembrokeshire's rugged coast. Plan unforgettable outdoor experiences across Wales.",
    siteName: "Adventure Wales",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adventure Wales | Your Welsh Adventure Starts Here",
    description: "Discover the wildest corners of Wales, from Snowdonia's misty peaks to Pembrokeshire's rugged coast. Plan unforgettable outdoor experiences across Wales.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.variable} font-sans antialiased text-slate-900 bg-slate-50`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
