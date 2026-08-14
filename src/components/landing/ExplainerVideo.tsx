"use client";

import { motion } from "framer-motion";
import { WalkthroughPlayer } from "@/components/video/WalkthroughPlayer";

export const ExplainerVideo = () => {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 bg-transparent text-[var(--color-uniloop-text)]">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-16 text-[var(--color-uniloop-text)]"
        >
          So, how does <br className="hidden md:block"/> UniLoop work?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-5xl rounded-3xl md:rounded-[2.5rem] bg-transparent border border-white/10 relative overflow-hidden group shadow-2xl"
        >
          <WalkthroughPlayer />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12 text-lg md:text-xl font-medium text-[var(--color-uniloop-secondary)] tracking-wide"
        >
          Made for life inside RGIPT.
        </motion.p>
      </div>
    </section>
  );
};
