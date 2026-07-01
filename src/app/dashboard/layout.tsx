"use client";

import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatPage = pathname?.startsWith('/dashboard/chat');

  return (
    <div className={`min-h-screen ${isChatPage ? 'pt-[76px] h-[100dvh] overflow-hidden' : 'pt-24 px-4 sm:px-6 pb-20'}`}>
      <div className={`${isChatPage ? 'h-[calc(100dvh-76px)]' : 'max-w-7xl mx-auto'}`}>
        {children}
      </div>
    </div>
  );
}
