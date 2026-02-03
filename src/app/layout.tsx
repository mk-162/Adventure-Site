import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Adventure Wales | Your Welsh Adventure Starts Here",
  description: "Discover the wildest corners of Wales, from Snowdonia's misty peaks to Pembrokeshire's rugged coast. Plan unforgettable outdoor experiences across Wales.",
  keywords: "Wales, adventure, outdoor activities, Snowdonia, Pembrokeshire, hiking, coasteering, surfing, mountain biking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
