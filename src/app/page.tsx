"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlassCard } from "@/components/ui/GlassCard";
import Image from "next/image";
import { ArrowRight, ShoppingBag, MessageSquare, PieChart, ShieldCheck } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
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

      // 3D Tilt Effect on Mockup
      const mockup = mockupRef.current;
      if (mockup) {
        mockup.addEventListener("mousemove", (e) => {
          const rect = mockup.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          
          gsap.to(mockup, {
            rotationY: x * 25, 
            rotationX: -y * 25,
            ease: "power2.out",
            duration: 0.4
          });
        });

        mockup.addEventListener("mouseleave", () => {
          gsap.to(mockup, {
            rotationY: 0,
            rotationX: 0,
            ease: "power3.out",
            duration: 1
          });
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-40 pb-20 px-6">
        <motion.div style={{ y }} className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-gray-200"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-lg font-bold text-gray-800">Exclusive for RGIPT Students</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-[1.1]"
          >
            Buy. Sell. Save. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
              Stay in the Loop.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-2xl text-grey-400 max-w-2xl mx-auto mb-10"
          >
            Your campus-only spot to buy, sell, and track your cash. Built by students, for students, to make campus life a breeze.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard/marketplace">
              <button className="px-8 py-4 rounded-full bg-black text-white font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                Explore Marketplace <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/auth">
              <button className="px-8 py-4 rounded-full glass-panel font-bold text-lg hover:bg-grey/10 transition-colors border-white/20">
                Join UniLoop
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* 3D Mockup / Market Element */}
        <motion.div 
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, type: "spring", bounce: 0.4 }}
          className="relative z-10 mt-20 w-full max-w-4xl mx-auto"
          style={{ perspective: 1500 }}
        >
          <div ref={mockupRef} className="relative w-full aspect-[16/9] rounded-[40px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.15)] border-[8px] border-white/80 bg-white group hover:shadow-[0_40px_120px_rgba(0,0,0,0.2)]">
            <Image 
              src="/3d-market.png" 
              alt="3D Marketplace Mockup" 
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              priority
            />
          </div>
        </motion.div>

        {/* Floating gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gray-300/20 rounded-full blur-[120px] -z-10" />
      </section>

      {/* Features Section */}
      <section className="features-section relative py-32 px-6 bg-gray-50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Everything you need, <br/><span className="text-gray-500">right on campus.</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">A simple, safe space built just for RGIPT students.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="flex flex-col items-start gap-4 group
  bg-white border-2 border-black
  shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-3 rounded-2xl bg-gray-100 text-black
group-hover:scale-110 transition-all duration-300">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-xl font-bold text-black">Thrift & Trade</h3>
              <p className="text-gray-400">Find textbooks, bikes, and dorm essentials from people you actually know.</p>
            </GlassCard>

            <GlassCard className="flex flex-col items-start gap-4 group
  bg-white border-2 border-black
  shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-3 rounded-2xl bg-gray-100 text-black
group-hover:scale-110 transition-all duration-300">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-bold text-black">Quick Chats</h3>
              <p className="text-gray-400">No more awkward DMs. Chat securely and lock in your deals fast.</p>
            </GlassCard>

           <GlassCard className="flex flex-col items-start gap-4 group
  bg-white border-2 border-black
  shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-3 rounded-2xl bg-gray-100 text-black
group-hover:scale-110 transition-all duration-300">
                <PieChart size={32} />
              </div>
              <h3 className="text-xl font-bold text-black">Track Your Cash</h3>
              <p className="text-gray-400">Keep an eye on your pocket money and save up for the weekend.</p>
            </GlassCard>

           <GlassCard className="flex flex-col items-start gap-4 group
  bg-white border-2 border-black
  shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-3 rounded-2xl bg-gray-100 text-black group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all duration-300">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-black">Safe & Verified</h3>
              <p className="text-gray-400">Only real RGIPT students allowed. No scammers, just your peers.</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* How it Works / Timeline */}
      <section className="timeline-section relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">How it works</h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
            
            {[
              { step: "01", title: "Verify your ID", desc: "Just use your college email to prove you're one of us." },
              { step: "02", title: "List or Browse", desc: "Snap a pic of what you're selling, or scroll through what others have." },
              { step: "03", title: "Chat & Meet", desc: "Ping the buyer/seller and agree to meet up near the hostel." },
              { step: "04", title: "Track & Save", desc: "Easily log what you spend or earn so you're never broke." }
            ].map((item, i) => (
              <div key={i} className="timeline-step relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#030303] bg-black text-white font-bold text-sm shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {item.step}
                </div>
                <div
  className="
    w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)]
    bg-white
    border-2 border-gray-200
    p-6
    rounded-2xl
    cursor-default
    transition-all duration-300
    hover:-translate-y-2
    hover:scale-105
    hover:shadow-2xl
    hover:border-black
  "
>
                  <h3 className="font-bold text-xl mb-1 text-black">{item.title}</h3>
                  <p className="text-black">{item.desc}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 pt-16 pb-8 px-6">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">

    {/* Left Side */}
    <div>
      <Link
        href="/"
        className="text-5xl font-bold tracking-tight text-black"
      >
        UniLoop
      </Link>

      <p className="text-black mt-3 font-medium">
        Built for RGIPT Students.
      </p>
    </div>

    {/* Right Side */}
    <div>
      <h3 className="text-2xl text-black mt-3 font-semibold">
        Quick Links
      </h3>

      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard/marketplace"
          className="text-xl font-medium text-gray-500 hover:text-black transition"
        >
          Marketplace
        </Link>

        <Link
          href="/dashboard/chat"
          className="text-xl font-medium text-gray-500 hover:text-black transition"
        >
          Chat
        </Link>

        <Link
          href="/dashboard/finance"
          className="text-xl font-medium text-gray-500 hover:text-black transition"
        >
          Finance
        </Link>

        <button
          className="mt-2 px-5 py-2 rounded-xl bg-black text-white font-medium hover:bg-neutral-800 transition"
        >
          Sign Out
        </button>
      </div>
    </div>

  </div>

  {/* Bottom Line */}
  <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
    © 2026 UniLoop. All rights reserved.
  </div>
</footer>
    </div>
  );
}
