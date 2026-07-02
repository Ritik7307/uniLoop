"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, User, Building, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { signIn, useSession } from "next-auth/react";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const [step, setStep] = useState<"login" | "profile" | "success">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Profile state
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [hostel, setHostel] = useState("");

  const router = useRouter();
  const { user, setUser, setWalletBalance, setMonthlyBudget } = useStore();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (user) {
        if (!user.department) {
          setName(user.name || session.user.name || "");
          setStep("profile");
        } else {
          router.push("/dashboard/marketplace");
        }
      }
    }
  }, [status, session, user, router]);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: "/auth" });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          department,
          year: "1st Year",
          hostel,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile.");

      setUser(data.user);
      setWalletBalance(data.user.walletBalance || 0);
      setMonthlyBudget(data.user.monthlyBudget || 5000);

      setStep("success");
      setTimeout(() => {
        router.push("/dashboard/marketplace");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <AnimatePresence mode="wait">
          {step === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold mb-2 tracking-tight text-slate-900">Welcome to UniLoop</h2>
                <p className="text-slate-500 text-sm font-medium">Sign in with your RGIPT Google Account</p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm font-medium text-center shadow-sm">
                  {errorMsg}
                </div>
              )}

              <motion.button 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                onClick={handleGoogleSignIn}
                disabled={isLoading || status === "loading"}
                className="w-full py-3 mt-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl flex justify-center items-center gap-3 transition-all shadow-sm"
              >
                {isLoading || status === "loading" ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </motion.button>
              <div className="mt-4 text-center text-xs text-slate-400">
                Only @rgipt.ac.in emails are allowed
              </div>
            </motion.div>
          )}

          {step === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold mb-2 tracking-tight text-slate-900">Setup Profile</h2>
                <p className="text-slate-500 text-sm font-medium">Tell us about your campus life</p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm font-medium text-center shadow-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
                  <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Full Name" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-3 pl-10 pr-4 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all shadow-sm appearance-none" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative">
                  <Building className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <select required value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all shadow-sm appearance-none">
                    <option value="" disabled>Select Department</option>
                    <optgroup label="B.Tech Branches">
                      <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                      <option value="Computer Science and Design Engineering">Computer Science and Design Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Mathematics and Computing">Mathematics and Computing</option>
                      <option value="Electronics Engineering">Electronics Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Chemical Engineering">Chemical Engineering</option>
                      <option value="Petroleum Engineering">Petroleum Engineering</option>
                      <option value="AI-Enabled Energy Engineering">AI-Enabled Energy Engineering</option>
                    </optgroup>
                    <optgroup label="Masters & Ph.D. Departments">
                      <option value="MBA / Management Studies">MBA / Management Studies</option>
                      <option value="PhD - Basic Sciences">Basic Sciences & Humanities</option>
                      <option value="PhD - Mathematical Sciences">Mathematical Sciences</option>
                      <option value="PhD - Chemical & Biochemical">Chemical & Biochemical Engineering</option>
                      <option value="PhD - Petroleum & Geoengineering">Petroleum Engineering & Geoengineering</option>
                      <option value="PhD - Computer Science">Computer Science and Engineering</option>
                      <option value="PhD - Management">Management Studies</option>
                    </optgroup>
                  </select>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <select required value={hostel} onChange={e => setHostel(e.target.value)} className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all shadow-sm appearance-none">
                    <option value="" disabled>Select Hostel</option>
                    <option value="C V Raman Hostel">C V Raman Hostel</option>
                    <option value="Ramanujan Hostel">Ramanujan Hostel</option>
                    <option value="Aryabhatta Hostel">Aryabhatta Hostel</option>
                    <option value="Vidyasagar Hostel">Vidyasagar Hostel</option>
                    <option value="Homi Bhabha Hostel">Homi Bhabha Hostel</option>
                    <option value="Girls Hostel">Girls Hostel</option>
                    <option value="Day Scholar">Day Scholar / Off-Campus</option>
                  </select>
                </motion.div>
                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} type="submit" disabled={isLoading} className="w-full py-3 mt-2 bg-brand hover:bg-brand-dark disabled:opacity-50 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-all shadow-sm">
                   {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Complete Profile"}
                </motion.button>
              </form>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-green-100"
              >
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </motion.div>
              <h2 className="text-3xl font-extrabold mb-2 text-slate-900 tracking-tight">Verified!</h2>
              <p className="text-slate-500 font-medium">Redirecting to dashboard...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
