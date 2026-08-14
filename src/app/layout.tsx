import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
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
      <body className={`${inter.className} antialiased selection:bg-[#F4A261]/50 text-[var(--color-uniloop-text)] bg-[var(--color-uniloop-bg)]`}>
        <AuthProvider>
          <NotificationProvider>
            <Navbar />
            <div 
              className="fixed inset-0 -z-10 bg-cover bg-center opacity-30 blur-md"
              style={{ backgroundImage: "url('/images/signpost.png')" }}
            />
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
