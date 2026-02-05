import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/ui/CookieBanner";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Adventure Wales | Honest Guide to Welsh Outdoor Adventures",
  description: "78 adventures across Wales with honest suitability info, local knowledge, and real difficulty ratings. Find what suits you - from Snowdonia summits to Pembrokeshire coasteering.",
  keywords: "Wales adventure, outdoor activities Wales, Snowdonia hiking, Pembrokeshire coasteering, mountain biking Wales, Welsh adventure guide",
  openGraph: {
    title: "Adventure Wales | Honest Guide to Welsh Outdoor Adventures",
    description: "78 adventures across Wales with honest suitability info, local knowledge, and real difficulty ratings. Find what suits you.",
    siteName: "Adventure Wales",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adventure Wales | Honest Guide to Welsh Outdoor Adventures",
    description: "78 adventures across Wales with honest suitability info, local knowledge, and real difficulty ratings.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${font.variable} font-sans antialiased text-slate-900 bg-slate-50`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:font-bold focus:text-sm focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
