"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { usePathname, useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, setWalletBalance, setMonthlyBudget } = useStore();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setWalletBalance(data.user.walletBalance || 0);
          setMonthlyBudget(data.user.monthlyBudget || 5000);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setWalletBalance, setMonthlyBudget]);

  useEffect(() => {
    if (!loading && !user && pathname.startsWith('/dashboard')) {
      router.push('/auth');
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900 font-bold">Loading...</div>;
  }

  // Prevent flash of protected content before redirect
  if (!user && pathname.startsWith('/dashboard')) {
    return null;
  }

  return <>{children}</>;
}
