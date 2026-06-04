"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Wallet, Bell, Menu, Infinity } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const { user, walletBalance, notifications } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between 
rounded-full px-8 py-3
bg-white/60 backdrop-blur-2xl
border border-white/50
shadow-[0_8px_32px_rgba(0,0,0,0.06)]">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl md:text-3xl font-extrabold tracking-tighter text-black group"
        >
          <div className="bg-black p-2 rounded-xl text-white group-hover:scale-105 transition-transform shadow-lg shadow-black/10">
            <Infinity size={28} strokeWidth={3} />
          </div>
          <span className="text-black">
            UniLoop
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-full border border-gray-100 shadow-inner">
          <Link
            href="/dashboard/marketplace"
            className="px-5 py-2 rounded-full text-base font-bold text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all"
          >
            Marketplace
          </Link>

          <Link
            href="/dashboard/chat"
            className="px-5 py-2 rounded-full text-base font-bold text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all"
          >
            Chat
          </Link>

          <Link
            href="/dashboard/finance"
            className="px-5 py-2 rounded-full text-base font-bold text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all"
          >
            Finance
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {user ? (
            <>
              {/* Wallet */}
              <Link href="/dashboard/finance">
                <div className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-full
                  bg-gray-100 border border-gray-200
                  hover:bg-gray-200 transition">
                  <Wallet size={18} className="text-black" />
                  <span className="text-lg font-bold text-black">
                    ₹{walletBalance}
                  </span>
                </div>
              </Link>

              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
                <Bell size={20} className="text-gray-700" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>

              {/* Profile */}
              <Link
                href="/dashboard/profile"
                className="w-12 h-12 rounded-full
                  bg-black
                  flex items-center justify-center
                  text-white text-lg font-bold
                  shadow-sm hover:scale-105 transition"
              >
                {user.name.charAt(0)}
              </Link>
            </>
          ) : (
            <Link href="/auth">
              <button className="px-6 py-2.5 rounded-full text-base font-bold
                bg-black text-white
                hover:opacity-80 transition-all shadow-md shadow-black/10 hover:shadow-lg hover:-translate-y-0.5">
                Join UniLoop
              </button>
            </Link>
          )}

          {/* Mobile */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={24} className="text-gray-800" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};