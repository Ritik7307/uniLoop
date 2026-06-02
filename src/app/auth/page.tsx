"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, Mail, Lock, CheckCircle2, User, Building, MapPin, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function AuthPage() {
  const [step, setStep] = useState<"login" | "profile" | "success">("login");
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Profile state
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [hostel, setHostel] = useState("");

  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const allowedDomain = "@rgipt.ac.in";
    if (!email.endsWith(allowedDomain)) {
      setErrorMsg("Only RGIPT students can register.");
      return;
    }
    
    setIsLoading(true);
    try {
      if (isLoginMode) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        // Check if profile exists
        const userDoc = await getDoc(doc(db, "users", cred.user.uid));
        if (userDoc.exists()) {
          setStep("success");
          setTimeout(() => router.push("/dashboard/marketplace"), 1000);
        } else {
          setStep("profile"); // Needs to complete profile
        }
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setStep("profile");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user found. Please restart the process.");
      
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: name,
        department: department,
        year: "1st Year", // simplified for demo
        hostel: hostel,
        walletBalance: 0,
        monthlyBudget: 5000,
        createdAt: new Date().toISOString()
      });

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-black relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] -z-10" />

      <GlassCard className="w-full max-w-md relative overflow-hidden" hoverEffect={false}>
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
                <h2 className="text-3xl font-bold mb-2">{isLoginMode ? "Welcome Back" : "Create Account"}</h2>
                <p className="text-gray-400 text-sm">Use your RGIPT college email</p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="student@rgipt.ac.in" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-3 mt-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex justify-center items-center gap-2 transition">
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : (isLoginMode ? "Sign In" : "Continue")}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </form>
              <div className="text-center mt-6">
                <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-sm text-indigo-400 hover:text-indigo-300 transition">
                  {isLoginMode ? "Need an account? Sign Up" : "Already have an account? Sign In"}
                </button>
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
                <h2 className="text-3xl font-bold mb-2">Setup Profile</h2>
                <p className="text-gray-400 text-sm">Tell us about your campus life</p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>
                <div className="relative">
                  <Building className="absolute left-3 top-3 text-gray-500" size={20} />
                  <select required value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none [&>option]:bg-gray-900">
                    <option value="" disabled>Select Department</option>
                    <option value="Petroleum Engineering">Petroleum Engineering</option>
                    <option value="Chemical Engineering">Chemical Engineering</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-500" size={20} />
                  <select required value={hostel} onChange={e => setHostel(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none [&>option]:bg-gray-900">
                    <option value="" disabled>Select Hostel</option>
                    <option value="APS Hall">APS Hall</option>
                    <option value="Rajiv Gandhi Hall">Rajiv Gandhi Hall</option>
                    <option value="Subarna Rekha Hall">Subarna Rekha Hall</option>
                  </select>
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-3 mt-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold rounded-xl flex justify-center items-center gap-2 transition">
                   {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Complete Profile"}
                </button>
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
                className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 size={40} />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">Verified!</h2>
              <p className="text-gray-400 text-sm">Redirecting to dashboard...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}
