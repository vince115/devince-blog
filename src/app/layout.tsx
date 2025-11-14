// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "devince-blog",
  description: "Vince 的技術筆記",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 dark:bg-neutral-900/60 flex flex-col min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <Navbar />
          <main className="max-w-full mx-0 px-6 py-6">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
