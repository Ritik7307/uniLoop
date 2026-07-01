"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { User, Mail, Building, MapPin, Edit3, LogOut, CheckCircle2, Loader2, X, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, setUser } = useStore();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState(user?.name || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [year, setYear] = useState(user?.year || "");
  const [hostel, setHostel] = useState(user?.hostel || "");

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication error. Please login again.");

      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, department, year, hostel })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile.");

      setUser(data.user);
      setIsEditing(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save profile.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20 text-slate-500">
        Please sign in to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pt-9 pb-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Student Profile</h1>
          <p className="text-slate-500 mt-2">Manage your identity and account settings.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-brand font-medium rounded-xl transition-all shadow-sm"
          >
            <Edit3 size={18} /> Edit Profile
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <div className="glass-panel rounded-3xl p-8 flex flex-col md:flex-row gap-10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-brand-dark via-brand to-brand-light flex items-center justify-center text-5xl font-bold text-white shadow-xl shadow-brand/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider border border-green-100">
            <CheckCircle2 size={14} /> Verified
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 w-full">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand focus:border-brand transition-shadow" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Department</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 text-slate-400" size={18} />
                  <select required value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand focus:border-brand transition-shadow appearance-none">
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
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Year</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <select required value={year} onChange={e => setYear(e.target.value)} className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand focus:border-brand transition-shadow appearance-none">
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="M.Tech/PhD">M.Tech/PhD</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Hostel</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                    <select required value={hostel} onChange={e => setHostel(e.target.value)} className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-brand focus:border-brand transition-shadow appearance-none">
                      <option value="" disabled>Select Hostel</option>
                      <option value="C V Raman Hostel">C V Raman Hostel</option>
                      <option value="Ramanujan Hostel">Ramanujan Hostel</option>
                      <option value="Aryabhatta Hostel">Aryabhatta Hostel</option>
                      <option value="Vidyasagar Hostel">Vidyasagar Hostel</option>
                      <option value="Homi Bhabha Hostel">Homi Bhabha Hostel</option>
                      <option value="Girls Hostel">Girls Hostel</option>
                      <option value="Day Scholar">Day Scholar / Off-Campus</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors flex justify-center items-center gap-2"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 text-center md:text-left">{user.name}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                    <Mail className="text-brand" size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">College Email</p>
                    <p className="text-slate-900 font-semibold truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                    <Building className="text-indigo-500" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Department</p>
                    <p className="text-slate-900 font-semibold line-clamp-1">{user.department || "Not Set"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <User className="text-emerald-500" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Year</p>
                    <p className="text-slate-900 font-semibold">{user.year || "Not Set"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                    <MapPin className="text-orange-500" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Hostel</p>
                    <p className="text-slate-900 font-semibold">{user.hostel || "Not Set"}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center md:justify-end">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-colors font-bold shadow-sm"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
}
