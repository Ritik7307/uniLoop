"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "POST",
    desc: "Have something to sell? Upload a photo, add a price and description, and post it."
  },
  {
    num: "02",
    title: "DISCOVER",
    desc: "Browse things available around RGIPT. (Electronics, Books, Cycles, etc.)"
  },
  {
    num: "03",
    title: "CONNECT",
    desc: "Interested in something? Connect with the student directly."
  },
  {
    num: "04",
    title: "LOOP",
    desc: "The item gets a new owner."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 md:py-32 bg-transparent" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {steps.map((step, idx) => (
          <div key={step.num} className="flex flex-col md:flex-row items-start md:items-center py-10 md:py-16 border-b border-[var(--color-uniloop-text)]/10 last:border-0 relative">
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <span className="text-sm font-bold text-[var(--color-uniloop-secondary)] mb-2 block">
                {step.num}
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[var(--color-uniloop-text)] tracking-tighter uppercase relative inline-block">
                {step.title}
                {step.title === "LOOP" && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-8 border-[3px] border-dashed border-[#F4A261] rounded-full opacity-50 hidden md:block"
                  />
                )}
              </h2>
            </div>
            <div className="w-full md:w-2/3 md:pl-16">
              <p className="text-xl md:text-2xl font-medium text-[var(--color-uniloop-text)] leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
        
      </div>
    </section>
  );
};
