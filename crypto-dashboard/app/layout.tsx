import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  description: "Real-time cryptocurrency market data and analytics",
};

function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-3 flex items-center gap-6">
      <span className="font-bold text-lg">Crypto Dashboard</span>
      <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Home</Link>
      <Link href="/market/news" className="text-sm text-gray-600 hover:text-gray-900">Market</Link>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
