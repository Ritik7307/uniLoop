"use client";

import { motion } from "framer-motion";
import { Users, Library, Home, Utensils, Activity, BookOpen } from "lucide-react";

const testimonials = [
  "Sold my old books.",
  "Found a calculator before my exam.",
  "Got my cycle back.",
  "Found a table for my hostel room.",
  "Passed my old notes to a junior.",
];

const campusLife = [
  { name: "Hostel", icon: Home },
  { name: "Academic Block", icon: BookOpen },
  { name: "Library", icon: Library },
  { name: "Mess", icon: Utensils },
  { name: "Sports", icon: Activity },
  { name: "Clubs", icon: Users },
];

export const CommunitySection = () => {
  return (
    <section className="py-24 md:py-32 overflow-hidden bg-transparent" id="about">
      
      {/* Made for RGIPT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-32">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-extrabold text-[var(--color-uniloop-text)] tracking-tight mb-6 leading-[1.1]"
            >
              Not the internet. <br/>
              <span className="text-[#E76F51]">Your campus.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-[var(--color-uniloop-secondary)] max-w-md font-medium"
            >
              UniLoop is designed around the way RGIPT students actually live, study, share, buy, sell and help each other.
            </motion.p>
          </div>
          
          <div className="w-full md:w-1/2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {campusLife.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/50 backdrop-blur-sm border border-[#17212B]/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 aspect-square premium-shadow group cursor-default"
              >
                <item.icon size={32} className="text-[#F4A261] group-hover:text-[#E76F51] transition-colors" />
                <span className="font-bold text-[var(--color-uniloop-text)] text-sm">{item.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-extrabold text-[var(--color-uniloop-text)] mb-16"
        >
          One campus. <br className="md:hidden" /> Thousands of possibilities.
        </motion.h3>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {testimonials.map((quote, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white px-6 md:px-8 py-4 md:py-5 rounded-full premium-shadow border border-[#17212B]/5 text-[var(--color-uniloop-text)] font-semibold text-lg md:text-xl"
            >
              "{quote}"
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
};
