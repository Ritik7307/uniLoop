"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlassCard } from "@/components/ui/GlassCard";
import Image from "next/image";
import { ArrowRight, ShoppingBag, MessageSquare, PieChart, ShieldCheck, HeartHandshake, Laptop, Book, Bike, Star, Users, CheckCircle2 } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const [stats, setStats] = useState({ users: 0, products: 0 });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats({
            users: data.users || 0,
            products: data.products || 0
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

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
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-white pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-sm font-semibold text-gray-700 tracking-wide uppercase">Exclusive for RGIPT Students</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1] text-slate-900"
          >
            Buy. Sell. Save. <br />
            <span className="text-brand">
              Stay in the Loop.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Your campus-only spot to buy, sell, and track your cash. Built by students, for students, to make campus life a breeze.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <Link href="/dashboard/marketplace">
              <button className="px-8 py-4 rounded-xl bg-brand text-white font-bold text-lg hover:bg-brand-dark transition-colors flex items-center gap-2 shadow-sm">
                Explore Marketplace <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/auth">
              <button className="px-8 py-4 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-50 transition-all shadow-sm">
                Join UniLoop
              </button>
            </Link>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex items-center justify-center gap-8 mt-16 flex-wrap"
          >
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Users className="text-brand" size={20} />
              <span>{stats.users.toLocaleString()} Verified Students</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden md:block"></div>
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <ShoppingBag className="text-brand" size={20} />
              <span>{stats.products.toLocaleString()} Items Listed</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden md:block"></div>
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <CheckCircle2 className="text-brand" size={20} />
              <span>100% Safe Campus Trades</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section relative py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Everything you need, <br/><span className="text-brand">right on campus.</span></h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">A simple, safe space built just for RGIPT students.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.2 }} className="feature-card flex flex-col items-start gap-4 group glass-panel rounded-3xl p-8 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-default">
              <div className="p-4 rounded-2xl bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm border border-blue-100 group-hover:border-blue-500 group-hover:shadow-blue-500/20">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Thrift & Trade</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Find textbooks, bikes, and dorm essentials from people you actually know. Save money instantly.</p>
            </motion.div>

            <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.2 }} className="feature-card flex flex-col items-start gap-4 group glass-panel rounded-3xl p-8 hover:shadow-xl hover:shadow-brand/5 transition-all cursor-default">
              <div className="p-4 rounded-2xl bg-brand-light/20 text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm border border-brand-light/30 group-hover:border-brand group-hover:shadow-brand/20">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Quick Chats</h3>
              <p className="text-slate-600 leading-relaxed font-medium">No more awkward DMs. Chat securely in-app and lock in your deals lightning fast.</p>
            </motion.div>

           <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.2 }} className="feature-card flex flex-col items-start gap-4 group glass-panel rounded-3xl p-8 hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-default">
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm border border-emerald-100 group-hover:border-emerald-500 group-hover:shadow-emerald-500/20">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Safe & Verified</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Only real RGIPT students allowed. We verify everyone using official college emails. Zero scammers.</p>
            </motion.div>
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
              { step: "03", title: "Chat & Meet", desc: "Ping the buyer/seller and agree to meet up near the hostel." }
            ].map((item, i) => (
              <div key={i} className="timeline-step relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-blue-600 text-white font-bold text-sm shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {item.step}
                </div>
                <div
                  className="
                    w-[calc(100%-4rem)] md:w-[calc(50%-3rem)]
                    bg-white
                    border border-gray-100
                    p-8
                    rounded-3xl
                    cursor-default
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                    hover:border-blue-100
                  "
                >
                  <h3 className="font-bold text-xl mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Left Side */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center w-8 h-8 bg-brand rounded-lg text-white">
                <HeartHandshake size={20} strokeWidth={2.5} />
              </div>
              <span>UniLoop</span>
            </Link>
            <p className="text-slate-500 mt-4 leading-relaxed font-medium">
              The exclusive platform built for RGIPT students. Buy, sell, trade, and connect securely within your campus network.
            </p>
          </div>

          {/* Right Side */}
          <div className="flex gap-16">
            <div>
              <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase mb-4">
                Explore
              </h3>
              <div className="flex flex-col gap-3">
                <Link href="/dashboard/marketplace" className="text-slate-500 hover:text-brand font-medium transition-colors">
                  Marketplace
                </Link>
                <Link href="/dashboard/chat" className="text-slate-500 hover:text-brand font-medium transition-colors">
                  Messages
                </Link>
                <Link href="/auth" className="text-slate-500 hover:text-brand font-medium transition-colors mt-2">
                  Create Account
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase mb-4">
                Company
              </h3>
              <div className="flex flex-col gap-3">
                <Link href="/about" className="text-slate-500 hover:text-brand font-medium transition-colors">
                  About Us
                </Link>
                <Link href="/dashboard/history" className="text-slate-500 hover:text-brand font-medium transition-colors">
                  My History
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-medium">
            © 2026 UniLoop. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-gray-400 text-sm">Privacy Policy</span>
            <span className="text-gray-400 text-sm">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
