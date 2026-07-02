import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import React from "react";

export const WalkthroughComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene 1: Welcome
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleY = spring({ frame, fps, config: { damping: 12 } });

  // Scene 2: Features (Buy, Sell, Chat)
  const featuresOpacity = interpolate(frame, [70, 85], [0, 1], { extrapolateRight: "clamp" });

  // Scene 3: Safety / Verification
  const safetyOpacity = interpolate(frame, [180, 195], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="bg-slate-900 text-white flex items-center justify-center font-sans overflow-hidden relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900" />
      
      {/* Scene 1: Welcome */}
      <Sequence from={0} durationInFrames={80}>
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
      <Sequence from={70} durationInFrames={120}>
        <AbsoluteFill className="flex items-center justify-center flex-col">
          <h2 
            style={{ opacity: featuresOpacity }} 
            className="text-4xl font-bold mb-10 text-white"
          >
            Everything you need
          </h2>
          <div 
            style={{ opacity: featuresOpacity }}
            className="flex gap-6"
          >
             <FeatureCard frame={frame} offset={75} icon="🛍️" title="Thrift & Trade" desc="Find dorm essentials & books" />
             <FeatureCard frame={frame} offset={85} icon="💬" title="Quick Chats" desc="Secure in-app messaging" />
             <FeatureCard frame={frame} offset={95} icon="💰" title="Save Money" desc="Deals from people you know" />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Safety & Verification */}
      <Sequence from={180} durationInFrames={100}>
        <AbsoluteFill className="flex items-center justify-center">
          <div 
            style={{ opacity: safetyOpacity }}
            className="flex flex-col items-center gap-6 max-w-2xl text-center"
          >
            <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-5xl mb-4 border border-emerald-500/30">
              🛡️
            </div>
            <h2 className="text-5xl font-bold text-white mb-2">100% Safe & Verified</h2>
            <p className="text-2xl text-slate-400 font-medium">
              Only real RGIPT students allowed. <br/>
              We verify everyone using official college emails.
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: Conclusion */}
      <Sequence from={270}>
        <AbsoluteFill className="flex items-center justify-center">
          <h2 
             style={{
               opacity: interpolate(frame, [270, 285], [0, 1], { extrapolateRight: "clamp" }),
               transform: `scale(${spring({ frame: frame - 270, fps, config: { damping: 12 } })})`
             }}
             className="text-6xl font-bold text-white text-center"
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
