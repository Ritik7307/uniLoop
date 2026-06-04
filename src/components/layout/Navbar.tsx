"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Wallet, Bell, Menu } from "lucide-react";
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
rounded-3xl px-10 py-5
bg-white/70 backdrop-blur-xl
border border-gray-200
shadow-[0_12px_40px_rgb(0,0,0,0.08)]">

        {/* Logo */}
        <Link
          href="/"
          className="text-4xl font-black tracking-tight text-gray-900"
        >
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            UniLoop
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/dashboard/marketplace"
            className="px-6 py-3 rounded-full text-lg font-semibold"
          >
            Marketplace
          </Link>

          <Link
            href="/dashboard/chat"
            className="px-6 py-3 rounded-full text-lg font-semibold"
          >
            Chat
          </Link>

          <Link
            href="/dashboard/finance"
            className="px-6 py-3 rounded-full text-lg font-semibold"
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
                  bg-indigo-50 border border-indigo-100
                  hover:bg-indigo-100 transition">
                  <Wallet size={18} className="text-indigo-600" />
                  <span className="text-lg font-bold text-indigo-700">
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
                  bg-gradient-to-br from-indigo-500 to-purple-500
                  flex items-center justify-center
                  text-white text-lg font-bold
                  shadow-sm hover:scale-105 transition"
              >
                {user.name.charAt(0)}
              </Link>
            </>
          ) : (
            <Link href="/auth">
              <button className="px-8 py-3 rounded-full text-lg font-semibold
                bg-gray-900 text-white
                hover:bg-gray-800 transition shadow-sm">
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