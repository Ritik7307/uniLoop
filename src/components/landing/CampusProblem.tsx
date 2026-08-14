"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const items = [
  "Books", "Calculator", "Cycle", "Desk lamp", 
  "Earphones", "Mattress", "Notes", "Electronics", "Sports equipment"
];

export const CampusProblem = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        }
      });

      // Floating items animation
      gsap.utils.toArray('.floating-item').forEach((item: any, i) => {
        tl.to(item, {
          y: i % 2 === 0 ? -50 : 50,
          x: i % 3 === 0 ? 30 : -30,
          rotation: i % 2 === 0 ? 10 : -10,
          opacity: 0.2,
          ease: "none"
        }, 0);
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 md:py-48 bg-transparent overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-extrabold text-[var(--color-uniloop-text)] tracking-tight mb-8"
        >
          Campus is full <br className="hidden md:block"/> of useful things.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-[var(--color-uniloop-secondary)] max-w-3xl mx-auto mb-32"
        >
          Old books. Cycles. Electronics. Furniture. Notes. Room essentials. And things people accidentally leave behind.
        </motion.p>

        <div ref={textRef} className="mt-48">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-2xl md:text-3xl text-[var(--color-uniloop-secondary)] mb-6 font-medium"
          >
            The problem isn't that these things don't exist.
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-7xl font-black text-[var(--color-uniloop-text)] tracking-tighter"
          >
            It's finding <br/> the right person.
          </motion.h3>
        </div>
      </div>

      {/* Floating Background Items */}
      <div ref={itemsRef} className="absolute inset-0 pointer-events-none opacity-40">
        {items.map((item, i) => {
          // Randomize positions slightly
          const top = `${15 + (i * 10)}%`;
          const left = i % 2 === 0 ? `${10 + (i * 3)}%` : `${70 - (i * 2)}%`;
          
          return (
            <div 
              key={item}
              className="floating-item hidden md:block absolute text-2xl md:text-4xl font-bold text-[var(--color-uniloop-text)] opacity-40 blur-[1px]"
              style={{ top, left }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </section>
  );
};
