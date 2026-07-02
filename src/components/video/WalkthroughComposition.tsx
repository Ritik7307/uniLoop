import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import React from "react";

export const WalkthroughComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene 1: Welcome
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleY = spring({ frame, fps, config: { damping: 12 } });

  // Scene 2: The Process (Buy, Sell, Save)
  const processOpacity = interpolate(frame, [60, 75], [0, 1], { extrapolateRight: "clamp" });
  
  return (
    <AbsoluteFill className="bg-slate-900 text-white flex items-center justify-center font-sans overflow-hidden relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900" />
      
      {/* Scene 1: Welcome */}
      <Sequence from={0} durationInFrames={70}>
        <AbsoluteFill className="flex items-center justify-center">
          <div 
            style={{ 
              opacity: titleOpacity, 
              transform: `translateY(${100 - titleY * 100}px)` 
            }}
            className="text-center"
          >
            <h1 className="text-6xl font-extrabold tracking-tight mb-4">Welcome to <span className="text-blue-500">UniLoop</span></h1>
            <p className="text-2xl text-slate-400 font-medium">The Exclusive RGIPT Marketplace</p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Feature highlights */}
      <Sequence from={60} durationInFrames={120}>
        <AbsoluteFill className="flex items-center justify-center">
          <div 
            style={{ opacity: processOpacity }}
            className="flex flex-col items-center gap-8"
          >
            <div className="flex gap-6">
               <FeatureCard frame={frame} offset={65} icon="🛍️" title="Buy" desc="Find what you need" />
               <FeatureCard frame={frame} offset={75} icon="💰" title="Sell" desc="Turn items to cash" />
               <FeatureCard frame={frame} offset={85} icon="🤝" title="Trade" desc="Safe on campus" />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Conclusion */}
      <Sequence from={170}>
        <AbsoluteFill className="flex items-center justify-center">
          <h2 
             style={{
               opacity: interpolate(frame, [170, 185], [0, 1], { extrapolateRight: "clamp" }),
               transform: `scale(${spring({ frame: frame - 170, fps, config: { damping: 12 } })})`
             }}
             className="text-5xl font-bold text-white text-center"
          >
            Stay in the <span className="text-blue-500">Loop.</span>
          </h2>
        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};

const FeatureCard: React.FC<{ frame: number; offset: number; icon: string; title: string; desc: string }> = ({ frame, offset, icon, title, desc }) => {
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - offset, fps, config: { damping: 14 } });
  const opacity = interpolate(frame, [offset, offset + 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div 
      style={{ 
        opacity,
        transform: `translateY(${50 - progress * 50}px) scale(${progress})` 
      }}
      className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl flex flex-col items-center justify-center w-64 text-center backdrop-blur-sm"
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 font-medium">{desc}</p>
    </div>
  );
};
