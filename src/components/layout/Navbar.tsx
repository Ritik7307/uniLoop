"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Bell, Menu, HeartHandshake, ChevronRight } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const { user, notifications } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === '/' || pathname?.startsWith('/auth')) return null;

  const navLinks = [
    { name: "Marketplace", href: "/dashboard/marketplace" },
    { name: "Lost & Found", href: "/dashboard/lost-found" },
    { name: "Messages", href: "/dashboard/chat" },
    { name: "History", href: "/dashboard/history" },
  ];

  return (
    <>
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between 
        rounded-2xl px-6 py-3.5
        bg-white/70 backdrop-blur-xl
        border border-white/40
        shadow-[0_8px_30px_rgba(0,0,0,0.04)]
        transition-all hover:bg-white/80"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src="/images/logo.png" alt="UniLoop Logo" className="h-14 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        {user && (
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-5 py-2 rounded-full text-sm font-semibold transition-all group"
                >
                  <span className={`relative z-10 ${isActive ? 'text-brand-dark' : 'text-slate-500 group-hover:text-slate-900'}`}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-brand-light/10 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors group">
                <Bell size={20} className="text-slate-600 group-hover:text-brand" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {/* Profile */}
              <Link
                href="/dashboard/profile"
                className="w-10 h-10 rounded-full
                  bg-gradient-to-br from-brand-dark to-brand-light
                  flex items-center justify-center
                  text-white text-base font-bold
                  shadow-md hover:shadow-xl hover:scale-105 transition-all
                  ring-2 ring-white/50"
              >
                {user.name.charAt(0).toUpperCase()}
              </Link>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/auth"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth"
                className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#17212B] text-white hover:bg-[#17212B]/90 transition-all hover:-translate-y-0.5 shadow-lg shadow-[#17212B]/20"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={24} className="text-slate-800" />
          </button>
        </div>
      </div>
    </motion.nav>

    {/* Mobile Dropdown */}
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="fixed top-24 left-4 right-4 z-40 bg-white/95 backdrop-blur-3xl border border-slate-100 rounded-3xl shadow-2xl p-5 md:hidden flex flex-col gap-3"
        >
          {user && navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              onClick={() => setIsOpen(false)} 
              className={`text-lg font-bold p-3 rounded-xl transition-colors ${
                pathname?.startsWith(link.href) ? 'bg-brand/10 text-brand-dark' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="border-t border-slate-100 pt-4 mt-2 px-3">
              <p className="text-sm text-slate-500 mb-1">Signed in as</p>
              <span className="font-bold text-slate-900 text-lg">{user.name}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Link 
                href="/auth" 
                onClick={() => setIsOpen(false)} 
                className="w-full py-4 text-center rounded-xl border-2 border-[#17212B] text-[#17212B] font-bold text-lg"
              >
                Login
              </Link>
              <Link 
                href="/auth" 
                onClick={() => setIsOpen(false)} 
                className="w-full py-4 text-center rounded-xl bg-[#17212B] text-white font-bold text-lg shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};