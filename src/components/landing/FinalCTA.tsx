"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export const FinalCTA = () => {
  return (
    <section className="relative py-32 md:py-48 bg-transparent overflow-hidden flex items-center justify-center min-h-[80vh]">
      
      {/* Background Loop Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] border-[1px] md:border-[2px] border-[#F4A261]/40 rounded-full absolute"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="w-[600px] h-[600px] md:w-[900px] md:h-[900px] border-[1px] md:border-[2px] border-[#E76F51]/20 rounded-full absolute"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-uniloop-text)] tracking-tight leading-[1.1] mb-12 text-balance"
        >
          What you don't need <br className="hidden md:block"/>
          <span className="text-[#E76F51]">might be exactly what</span> <br className="hidden md:block"/>
          someone else needs.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-uniloop-text)] mb-4">
            UniLoop
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base font-bold text-[var(--color-uniloop-secondary)] tracking-widest uppercase">
            <span>Buy</span> &bull; 
            <span>Sell</span> &bull; 
            <span>Lost</span> &bull; 
            <span>Found</span> &bull; 
            <span>Connect</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/auth"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--color-uniloop-text)] text-[#F5EAE0] text-lg font-bold hover:bg-[#17212B]/90 transition-all hover:scale-105 shadow-xl shadow-[#17212B]/10"
          >
            Enter UniLoop
          </Link>
          <Link
            href="/dashboard/marketplace"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[var(--color-uniloop-text)] border border-[#17212B]/10 text-lg font-bold hover:bg-slate-50 transition-all hover:scale-105"
          >
            Explore Marketplace
          </Link>
        </motion.div>
        
      </div>
    </section>
  );
};
