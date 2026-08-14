"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "BUY",
    description: "Find useful things from fellow students.",
    color: "bg-[#F4A261]/10 border-[#F4A261]/30 text-[#17212B]",
  },
  {
    title: "SELL",
    description: "Give your unused items a new home.",
    color: "bg-[#E76F51]/10 border-[#E76F51]/30 text-[#17212B]",
  },
  {
    title: "LOST",
    description: "Report something you've lost on campus.",
    color: "bg-[#17212B]/5 border-[#17212B]/20 text-[#17212B]",
  },
  {
    title: "FOUND",
    description: "Help return something to its owner.",
    color: "bg-transparent border-[#17212B]/10 text-[#17212B] shadow-sm",
  },
];

export const UniLoopIntro = () => {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-extrabold text-[var(--color-uniloop-text)] tracking-tight mb-6"
        >
          A marketplace built <br className="hidden md:block"/> for your campus.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-lg md:text-xl text-[var(--color-uniloop-secondary)] max-w-2xl text-balance"
        >
          UniLoop helps RGIPT students buy, sell, discover, and find things without leaving campus.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`p-8 md:p-10 rounded-[2rem] border ${feature.color} flex flex-col justify-between min-h-[200px] md:min-h-[300px] transition-all duration-300`}
          >
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              {feature.title}
            </h3>
            <p className="text-lg font-medium opacity-80 leading-snug">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
