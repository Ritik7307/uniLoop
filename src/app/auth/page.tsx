"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, Mail, Lock, CheckCircle2, User, Building, MapPin, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function AuthPage() {
  const [step, setStep] = useState<"login" | "otp" | "profile" | "success" | "forgot-password" | "reset-password">("login");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState("");
  const [otp, setOtp] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Profile state
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [hostel, setHostel] = useState("");

  const router = useRouter();

  const { setUser, setWalletBalance, setMonthlyBudget } = useStore();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const allowedDomain = "@rgipt.ac.in";
    if (!email.endsWith(allowedDomain)) {
      setErrorMsg("Only @rgipt.ac.in emails are allowed.");
      return;
    }
    
    setIsLoading(true);
    try {
      if (isLoginMode) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || "Login failed");
        
        localStorage.setItem('token', data.token);
        
        if (!data.user.department) {
          setStep("profile"); // Needs to complete profile
        } else {
          setUser(data.user);
          setWalletBalance(data.user.walletBalance || 0);
          setMonthlyBudget(data.user.monthlyBudget || 5000);
          router.push("/dashboard/marketplace");
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: email.split('@')[0], email, password })
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || "Registration failed");
        
        setRegisteredUserId(data.userId);
        setStep("otp");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: registeredUserId, otp })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      
      localStorage.setItem('token', data.token);
      setStep("profile");
    } catch (err: any) {
      setErrorMsg(err.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const allowedDomain = "@rgipt.ac.in";
    if (!email.endsWith(allowedDomain)) {
      setErrorMsg("Please enter a valid RGIPT email.");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to request password reset");
      
      setStep("reset-password");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to request password reset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      
      // Success, go back to login
      setStep("login");
      setIsLoginMode(true);
      setPassword("");
      setNewPassword("");
      setOtp("");
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No user found. Please restart the process.");
      
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
      {/* Background grid */}
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
                <h2 className="text-3xl font-extrabold mb-2 tracking-tight text-slate-900">{isLoginMode ? "Welcome Back" : "Create Account"}</h2>
                <p className="text-slate-500 text-sm font-medium">Use your RGIPT college email</p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm font-medium text-center shadow-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="RGIPT Email"
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-3 pl-10 pr-4 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all shadow-sm"
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative">
                 <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-3 pl-10 pr-12 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all shadow-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </motion.div>
                
                {isLoginMode && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                    <button type="button" onClick={() => setStep("forgot-password")} className="text-xs text-brand font-bold hover:underline">
                      Forgot Password?
                    </button>
                  </motion.div>
                )}
                
                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} type="submit" disabled={isLoading} className="w-full py-3 mt-2 bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-all shadow-sm">
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : (isLoginMode ? "Sign In" : "Continue")}
                  {!isLoading && <ArrowRight size={18} />}
                </motion.button>
              </form>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center mt-6">
                <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-sm text-slate-500 hover:text-brand transition-colors font-bold">
                  {isLoginMode ? "Need an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </motion.div>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold mb-2 tracking-tight text-slate-900">Verify Email</h2>
                <p className="text-slate-500 text-sm font-medium">We sent a 6-digit code to <br/><span className="font-bold text-slate-700">{email}</span></p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm font-medium text-center shadow-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-3 pl-10 pr-4 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all shadow-sm tracking-widest font-mono text-center text-lg"
                  />
                </motion.div>
                
                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} type="submit" disabled={isLoading || otp.length !== 6} className="w-full py-3 mt-2 bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-all shadow-sm">
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Verify Code"}
                  {!isLoading && <ArrowRight size={18} />}
                </motion.button>
              </form>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mt-6">
                <button onClick={() => setStep("login")} className="text-sm text-slate-500 hover:text-brand transition-colors font-bold">
                  Cancel Registration
                </button>
              </motion.div>
            </motion.div>
          )}

          {step === "forgot-password" && (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold mb-2 tracking-tight text-slate-900">Reset Password</h2>
                <p className="text-slate-500 text-sm font-medium">Enter your email to receive a code</p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm font-medium text-center shadow-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="RGIPT Email"
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-3 pl-10 pr-4 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all shadow-sm"
                  />
                </motion.div>
                
                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} type="submit" disabled={isLoading} className="w-full py-3 mt-2 bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-all shadow-sm">
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Send Reset Code"}
                  {!isLoading && <ArrowRight size={18} />}
                </motion.button>
              </form>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mt-6">
                <button onClick={() => { setStep("login"); setErrorMsg(""); }} className="text-sm text-slate-500 hover:text-brand transition-colors font-bold">
                  Back to Sign In
                </button>
              </motion.div>
            </motion.div>
          )}

          {step === "reset-password" && (
            <motion.div
              key="reset-password"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold mb-2 tracking-tight text-slate-900">Create New Password</h2>
                <p className="text-slate-500 text-sm font-medium">We sent a 6-digit code to <br/><span className="font-bold text-slate-700">{email}</span></p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm font-medium text-center shadow-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    placeholder="Enter 6-digit code"
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-3 pl-10 pr-4 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all shadow-sm tracking-widest font-mono text-center text-lg mb-2"
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="New Password"
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-3 pl-10 pr-12 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </motion.div>
                
                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} type="submit" disabled={isLoading || otp.length !== 6 || newPassword.length < 6} className="w-full py-3 mt-2 bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex justify-center items-center gap-2 transition-all shadow-sm">
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
                  {!isLoading && <ArrowRight size={18} />}
                </motion.button>
              </form>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center mt-6">
                <button onClick={() => { setStep("login"); setErrorMsg(""); }} className="text-sm text-slate-500 hover:text-brand transition-colors font-bold">
                  Cancel
                </button>
              </motion.div>
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
