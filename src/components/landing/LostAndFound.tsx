"use client";

import { motion } from "framer-motion";
import { ArrowRight, Search, PlusCircle } from "lucide-react";

export const LostAndFound = () => {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 bg-[#F4A261]/10" id="lost-found">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold text-[var(--color-uniloop-text)] tracking-tight mb-6"
          >
            Lost something?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-[var(--color-uniloop-secondary)] font-medium"
          >
            Someone on campus might have found it.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 relative">
          
          {/* LOST Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="w-full lg:w-[45%] bg-white rounded-[2rem] p-8 md:p-12 premium-shadow z-10 border border-[#17212B]/5"
          >
            <h3 className="text-3xl font-black text-[var(--color-uniloop-text)] mb-8 flex items-center gap-3">
              <Search className="text-[#F4A261]" size={32} />
              LOST SOMETHING
            </h3>
            <ul className="space-y-4 mb-10 text-[var(--color-uniloop-secondary)] font-medium">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#17212B]/20" /> Item name</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#17212B]/20" /> Description</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#17212B]/20" /> Location</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#17212B]/20" /> Date & Photo</li>
            </ul>
            <button className="w-full py-4 rounded-xl bg-[var(--color-uniloop-text)] text-white font-bold tracking-wide hover:bg-[#17212B]/90 transition-colors flex items-center justify-center gap-2">
              Report Lost Item <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Connection */}
          <div className="w-full lg:w-[10%] flex flex-col items-center justify-center relative lg:h-[400px]">
             {/* Desktop connection line */}
             <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#F4A261] to-transparent -translate-y-1/2" />
             
             <motion.div
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
               className="bg-[#F4A261]/20 backdrop-blur-md px-6 py-3 rounded-full border border-[#F4A261]/30 text-[var(--color-uniloop-text)] font-bold text-sm tracking-widest z-10 my-4 lg:my-0"
             >
               UNILOOP
             </motion.div>
          </div>

          {/* FOUND Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="w-full lg:w-[45%] bg-[#F4A261]/20 rounded-[2rem] p-8 md:p-12 premium-shadow z-10 border border-[#F4A261]/30"
          >
            <h3 className="text-3xl font-black text-[var(--color-uniloop-text)] mb-8 flex items-center gap-3">
              <PlusCircle className="text-[#E76F51]" size={32} />
              FOUND SOMETHING
            </h3>
            <ul className="space-y-4 mb-10 text-[var(--color-uniloop-secondary)] font-medium">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#17212B]/20" /> Item name</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#17212B]/20" /> Where you found it</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#17212B]/20" /> Date</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#17212B]/20" /> Photo</li>
            </ul>
            <button className="w-full py-4 rounded-xl bg-white text-[var(--color-uniloop-text)] border border-[#17212B]/10 font-bold tracking-wide hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              Report Found Item <ArrowRight size={18} />
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
