"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Wallet, Bell, Menu, User, Settings } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const { user, walletBalance, notifications } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-panel rounded-full px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600">
          UniLoop.
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/dashboard/marketplace" className="text-gray-600 hover:text-gray-900 transition-colors">Marketplace</Link>
          <Link href="/dashboard/chat" className="text-gray-600 hover:text-gray-900 transition-colors">Chat</Link>
          <Link href="/dashboard/finance" className="text-gray-600 hover:text-gray-900 transition-colors">Finance Tracker</Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard/finance">
                <div className="hidden sm:flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1.5 cursor-pointer hover:bg-indigo-500/20 transition">
                  <Wallet size={16} className="text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-300">₹{walletBalance}</span>
                </div>
              </Link>
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
                <Bell size={20} className="text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
              <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg cursor-pointer text-white">
                {user.name.charAt(0)}
              </Link>
            </>
          ) : (
            <Link href="/auth">
              <button className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors">
                Join UniLoop
              </button>
            </Link>
          )}

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-gray-900" onClick={() => setIsOpen(!isOpen)}>
            <Menu size={24} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
