"use client";

import { useStore } from "@/store/useStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { User, Mail, Building, MapPin, Edit3, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, setUser } = useStore();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-400">
        Please sign in to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pt-9 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-black">Student Profile</h1>
        <p className="text-blue-400 mt-2">Manage your identity and account settings.</p>
      </div>

      <GlassCard className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8" hoverEffect={false}>
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_40px_rgba(99,102,241,0.4)]">
            {user.name.charAt(0)}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-white text-black rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
            <Edit3 size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div>
            <h2 className="text-3xl font-bold text-white text-center md:text-left">{user.name}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-indigo-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Verified Student
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
              <Mail className="text-gray-400" size={18} />
              <div className="overflow-hidden">
                <p className="text-xs text-blue-500 uppercase tracking-wider">College Email</p>
                <p className="text-black text-sm font-medium truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
              <Building className="text-gray-400" size={18} />
              <div>
                <p className="text-xs text-blue-500 uppercase tracking-wider">Department</p>
                <p className="text-black text-sm font-medium">{user.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
              <User className="text-gray-400" size={18} />
              <div>
                <p className="text-xs text-blue-500 uppercase tracking-wider">Year</p>
                <p className="text-black text-sm font-medium">{user.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
              <MapPin className="text-gray-400" size={18} />
              <div>
                <p className="text-xs text-blue-500 uppercase tracking-wider">Hostel</p>
                <p className="text-black text-sm font-medium">{user.hostel}</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="flex justify-end">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition font-semibold"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
}
