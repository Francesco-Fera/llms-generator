import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LLMS.txt Generator",
  description: "Generate llms.txt file for free",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-slate-50 to-slate-100`}
      >
        <Navbar />
        <div className=''>{children}</div>
        <Footer />
        <Toaster />
        <Script
          defer
          src='https://cloud.umami.is/script.js'
          data-website-id='211d6f1f-eee4-45a7-8b2c-98f9b9d6e5b1'
        ></Script>
      </body>
    </html>
  );
}
