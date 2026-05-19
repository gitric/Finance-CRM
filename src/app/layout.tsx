import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuditCRM - Financial Auditor Portal",
  description: "CRM for managing finance managers, training, certifications and audits across multiple entities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)] flex`}
      >
        <AppSidebar />
        <main className="flex-1 overflow-auto h-screen bg-background">
          <div className="p-8 max-w-7xl mx-auto">{children}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}