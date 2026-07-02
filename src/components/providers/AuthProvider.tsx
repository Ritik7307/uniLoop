"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { usePathname, useRouter } from "next/navigation";

function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { user, setUser, setWalletBalance, setMonthlyBudget } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const syncUser = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const res = await fetch('/api/profile');
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setWalletBalance(data.user.walletBalance || 0);
            setMonthlyBudget(data.user.monthlyBudget || 5000);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Auth sync failed:", error);
          setUser(null);
        }
      } else if (status === "unauthenticated") {
        setUser(null);
      }
    };
    syncUser();
  }, [session, status, setUser, setWalletBalance, setMonthlyBudget]);

  useEffect(() => {
    if (status === "unauthenticated" && pathname.startsWith('/dashboard')) {
      router.push('/auth');
    }
  }, [status, pathname, router]);

  if (status === "loading") {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900 font-bold">Loading...</div>;
  }

  if (status === "unauthenticated" && pathname.startsWith('/dashboard')) {
    return null;
  }

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthSync>
        {children}
      </AuthSync>
    </SessionProvider>
  );
}
