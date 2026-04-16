import type { Metadata } from "next";
import { Nunito, Playfair_Display } from "next/font/google";

import { Footer } from "@/components/footer";
import { ChatbotWidget } from "@/components/chatbot-widget";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import "./globals.css";

const bodyFont = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kamay Kainan | Modern Filipino Restaurant",
  description:
    "Kamay Kainan is a modern Filipino restaurant web app with online menu, cart, ordering, and realtime updates.",
  icons: {
    icon: "/favicon-kamay.svg",
    shortcut: "/favicon-kamay.svg",
    apple: "/favicon-kamay.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream-50 text-kape-900">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 motion-stack">{children}</main>
            <Footer />
            <ChatbotWidget />
          </div>
        </Providers>
      </body>
    </html>
  );
}
