"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

export const HeroScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialLogoRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const revealsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%", // Adjusted timing
          scrub: 1,
          pin: true,
        },
      });

      // 1. Initial Logo scattering
      tl.to(".initial-letter", {
        x: "random(-60vw, 60vw)",
        y: "random(-60vh, 60vh)",
        rotation: "random(-180, 180)",
        opacity: 0,
        scale: "random(0.2, 2)",
        stagger: 0.05,
        duration: 1,
        ease: "power2.inOut"
      }, 0);
      
      // 2. EVERYTHING ON CAMPUS fades in
      tl.to(wordsRef.current, {
        opacity: 1,
        duration: 0.5
      }, ">-0.5");

      // 3. Words separating
      tl.to(".word-everything", { x: "-30vw", y: "-20vh", scale: 0.8 }, ">");
      tl.to(".word-on", { x: "0vw", y: "-35vh", scale: 0.8 }, "<");
      tl.to(".word-campus", { x: "30vw", y: "-20vh", scale: 0.8 }, "<");

      // 4. Reveals appearing
      tl.fromTo(
        ".reveal-word",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, stagger: 0.1, duration: 1 },
        "-=0.2"
      );

      // 5. Everything converging
      tl.to(
        [".word-everything", ".word-on", ".word-campus", ".reveal-word"],
        { x: "0vw", y: "0vh", opacity: 0, scale: 0, duration: 1 },
        ">"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full bg-transparent overflow-hidden relative flex items-center justify-center font-sans"
    >
      {/* Initial Logo State */}
      <div
        ref={initialLogoRef}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30"
      >
        <div className="text-[15vw] md:text-[10vw] font-black tracking-tight text-[var(--color-uniloop-text)] flex">
          {["U", "n", "i", "L", "o", "o", "p"].map((char, index) => (
            <span key={index} className="initial-letter inline-block">
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Primary Words State */}
      <div
        ref={wordsRef}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 opacity-0"
      >
        <h1 className="text-[10vw] md:text-[6vw] font-black leading-none text-[var(--color-uniloop-text)] tracking-tighter text-center uppercase">
          <div className="word-everything inline-block">Everything</div>
          <br />
          <div className="word-on inline-block text-[var(--color-uniloop-secondary)]">
            On
          </div>
          <br />
          <div className="word-campus inline-block">Campus</div>
        </h1>
      </div>

      {/* Reveals */}
      <div
        ref={revealsRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="reveal-word absolute top-[65%] left-[15%] text-3xl md:text-5xl font-black text-[var(--color-uniloop-text)]">BUY</div>
        <div className="reveal-word absolute top-[20%] right-[15%] text-3xl md:text-5xl font-black text-[#E76F51]">SELL</div>
        <div className="reveal-word absolute bottom-[10%] left-[25%] text-3xl md:text-5xl font-black text-[var(--color-uniloop-text)]">DISCOVER</div>
        <div className="reveal-word absolute bottom-[15%] right-[25%] text-3xl md:text-5xl font-black text-[#E76F51]">CONNECT</div>
        <div className="reveal-word absolute top-[40%] left-[10%] text-3xl md:text-5xl font-black text-[var(--color-uniloop-text)] opacity-80">LOST</div>
        <div className="reveal-word absolute top-[50%] right-[10%] text-3xl md:text-5xl font-black text-[var(--color-uniloop-text)] opacity-80">FOUND</div>
      </div>



      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-uniloop-secondary)] animate-bounce z-40">
        <span className="text-sm font-semibold tracking-widest uppercase">Scroll</span>
        <ChevronDown size={24} />
      </div>
    </div>
  );
};
