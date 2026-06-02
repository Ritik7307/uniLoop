"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, ShoppingBag, MessageSquare, PieChart, ShieldCheck } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    // GSAP Scroll Animations
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 70%",
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      gsap.from(".timeline-step", {
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top 75%",
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "back.out(1.7)",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <HeroCanvas />
        <motion.div style={{ y }} className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-indigo-500/30"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-sm font-medium text-indigo-200">Exclusive for RGIPT Students</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-[1.1]"
          >
            Buy. Sell. Save. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient">
              Stay in the Loop.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Campus-exclusive marketplace and student finance companion. Built for trust, speed, and beautiful experiences.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard/marketplace">
              <button className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                Explore Marketplace <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/auth">
              <button className="px-8 py-4 rounded-full glass-panel font-bold text-lg hover:bg-white/10 transition-colors border-white/20">
                Join UniLoop
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10" />
      </section>

      {/* Features Section */}
      <section className="features-section relative py-32 px-6 bg-black/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Everything you need. <br/><span className="text-indigo-400">In one loop.</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">A premium ecosystem designed exclusively for campus life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="feature-card flex flex-col items-start gap-4 group">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-xl font-bold">Campus Marketplace</h3>
              <p className="text-gray-400">Buy and sell items exclusively with verified RGIPT students.</p>
            </GlassCard>

            <GlassCard className="feature-card flex flex-col items-start gap-4 group">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-bold">Real-Time Chat</h3>
              <p className="text-gray-400">Negotiate and finalize deals instantly with built-in secure messaging.</p>
            </GlassCard>

            <GlassCard className="feature-card flex flex-col items-start gap-4 group">
              <div className="p-3 rounded-2xl bg-green-500/10 text-green-400 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                <PieChart size={32} />
              </div>
              <h3 className="text-xl font-bold">Expense Tracking</h3>
              <p className="text-gray-400">Manage your pocket money, track spending, and hit savings goals.</p>
            </GlassCard>

            <GlassCard className="feature-card flex flex-col items-start gap-4 group">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold">Verified Network</h3>
              <p className="text-gray-400">100% verified student profiles ensure a safe and fraud-free environment.</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* How it Works / Timeline */}
      <section className="timeline-section relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">How it works</h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-indigo-500/50 before:to-transparent">
            
            {[
              { step: "01", title: "Verify your ID", desc: "Sign up with your college email and verify your student status." },
              { step: "02", title: "List or Browse", desc: "Upload items you want to sell, or browse the campus feed." },
              { step: "03", title: "Chat & Meet", desc: "Securely message buyers and arrange a meet-up at the hostel." },
              { step: "04", title: "Track & Save", desc: "Log your earnings and expenses to stay on top of your budget." }
            ].map((item, i) => (
              <div key={i} className="timeline-step relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#030303] bg-indigo-500 text-white font-bold text-sm shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {item.step}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-6 rounded-2xl hover:scale-105 transition-transform duration-300 cursor-default">
                  <h3 className="font-bold text-xl mb-1 text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60 pt-16 pb-8 px-6 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tight text-white">
              UniLoop.
            </Link>
            <p className="text-gray-500 mt-2">Built for RGIPT Students.</p>
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-400">
            <Link href="#" className="hover:text-white transition">Privacy</Link>
            <Link href="#" className="hover:text-white transition">Terms</Link>
            <Link href="#" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
