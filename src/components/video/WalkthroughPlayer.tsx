"use client";

import { Player } from "@remotion/player";
import { WalkthroughComposition } from "./WalkthroughComposition";
import React from "react";

export const WalkthroughPlayer: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900 relative">
      <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 flex items-center px-4 gap-2 z-10">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="pt-8 aspect-video">
        <Player
          component={WalkthroughComposition}
          durationInFrames={240}
          compositionWidth={1280}
          compositionHeight={720}
          fps={30}
          style={{
            width: "100%",
            height: "100%",
          }}
          controls
          autoPlay
          loop
        />
      </div>
    </div>
  );
};
