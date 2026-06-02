"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Users, AlertTriangle, Box, Activity, Trash2, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
          Admin Control Center <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/20">Authorized Only</span>
        </h1>
        <p className="text-gray-400 mt-2">Manage users, moderate marketplace listings, and review reports.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="font-medium text-sm">Active Students</span>
            <Users size={16} />
          </div>
          <div className="text-3xl font-bold text-white">1,248</div>
        </GlassCard>
        <GlassCard className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="font-medium text-sm">Pending Verifications</span>
            <Activity size={16} />
          </div>
          <div className="text-3xl font-bold text-indigo-400">12</div>
        </GlassCard>
        <GlassCard className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="font-medium text-sm">Active Listings</span>
            <Box size={16} />
          </div>
          <div className="text-3xl font-bold text-white">436</div>
        </GlassCard>
        <GlassCard className="flex flex-col gap-2 border-red-500/30 bg-red-500/5">
          <div className="flex justify-between items-center text-red-400">
            <span className="font-medium text-sm">Reported Flags</span>
            <AlertTriangle size={16} />
          </div>
          <div className="text-3xl font-bold text-red-400">3</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Verification Queue */}
        <GlassCard hoverEffect={false}>
          <h2 className="text-xl font-bold text-white mb-6">ID Verifications</h2>
          <div className="space-y-4">
            {[1, 2].map(id => (
              <div key={id} className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                    ID
                  </div>
                  <div>
                    <h3 className="text-white font-medium">pending_user_{id}@rgipt.ac.in</h3>
                    <p className="text-xs text-gray-500">Submitted 2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition"><CheckCircle size={16} /></button>
                  <button className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Flagged Content */}
        <GlassCard hoverEffect={false}>
          <h2 className="text-xl font-bold text-white mb-6">Flagged Listings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/5 border border-red-500/30 rounded-xl">
              <div>
                <h3 className="text-white font-medium">Free Spotify Premium (Account)</h3>
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertTriangle size={12}/> Reported as Spam / Policy Violation</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-lg transition">Review</button>
                <button className="px-3 py-1.5 text-xs font-bold bg-red-500 hover:bg-red-600 text-white rounded-lg transition">Remove</button>
              </div>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
