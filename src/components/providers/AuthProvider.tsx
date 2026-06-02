"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useStore } from "@/store/useStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setWalletBalance, setMonthlyBudget } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch extended profile data from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: data.email,
            name: data.name,
            department: data.department,
            year: data.year,
            hostel: data.hostel,
          });
          setWalletBalance(data.walletBalance || 0);
          setMonthlyBudget(data.monthlyBudget || 5000);
        } else {
          // If no doc exists yet (e.g. during initial signup before profile creation)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || "",
            department: "",
            year: "",
            hostel: "",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setWalletBalance, setMonthlyBudget]);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  return <>{children}</>;
}
