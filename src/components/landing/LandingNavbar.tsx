"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-4 transition-all duration-300 ${
        scrolled ? "glass-nav py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/images/logo.png" alt="UniLoop Logo" className="h-14 md:h-16 w-auto object-contain" />
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/auth"
            className="text-sm font-semibold text-[#17212B] hover:text-[#E76F51] transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth"
            className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#17212B] text-white hover:bg-[#17212B]/90 transition-all hover:-translate-y-0.5 shadow-lg shadow-[#17212B]/20"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};
