"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Users, Target, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function AboutPage() {
  const { user } = useStore();
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand font-medium transition-colors mb-10">
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            About <span className="text-brand">UniLoop</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed font-medium mb-12">
            Built by students, for students. UniLoop is the exclusive ecosystem designed to make campus life at RGIPT simpler, safer, and more connected.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-slate-100 text-brand rounded-xl flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">
              To create a seamless, localized marketplace where students can easily buy, sell, and trade essentials without the hassle of outside platforms or shipping fees.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-slate-100 text-brand rounded-xl flex items-center justify-center mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Safe & Verified</h3>
            <p className="text-slate-600 leading-relaxed">
              Every user on UniLoop is verified using their official RGIPT college email. No scammers, no outsiders—just your peers and batchmates.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-slate-100 text-brand rounded-xl flex items-center justify-center mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Community Driven</h3>
            <p className="text-slate-600 leading-relaxed">
              From freshers looking for textbooks to seniors selling their bikes, UniLoop fosters a sustainable cycle of sharing resources within the campus.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-slate-100 text-brand rounded-xl flex items-center justify-center mb-6">
              <Heart size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Made with Love</h3>
            <p className="text-slate-600 leading-relaxed">
              Developed by tech-enthusiasts at RGIPT. We understand the campus problems because we live them every day.
            </p>
          </motion.div>
        </div>

        {!user && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }} className="text-center">
            <Link href="/auth">
              <button className="px-8 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors shadow-sm">
                Join the Community
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
