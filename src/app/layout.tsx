import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });
import { Navbar } from "@/components/layout/Navbar";
import { AuthProvider } from "@/components/providers/AuthProvider";
import NotificationProvider from "@/components/providers/NotificationProvider";

export const metadata: Metadata = {
  title: "UniLoop | Campus Marketplace",
  description: "Exclusive student ecosystem for buying, selling, and connecting at RGIPT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} antialiased selection:bg-blue-500/30 text-slate-900 bg-slate-50`}>
        <AuthProvider>
          <NotificationProvider>
            <Navbar />
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
