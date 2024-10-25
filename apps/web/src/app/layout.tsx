import "./globals.css";

import type { Metadata } from "next";
import { Sidebar } from "~/components/sidebar";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} flex h-screen overflow-hidden p-4 antialiased`}>
        <main className="text-layout-foreground shadow-window flex flex-1 gap-2 rounded-2xl border border-white/20 bg-white/30 bg-[url('/noise.svg')] bg-[length:250px_250px] bg-repeat p-2 bg-blend-multiply ring ring-black/10 backdrop-blur-3xl">
          <Sidebar />
          {children}
        </main>
      </body>
    </html>
  );
}
