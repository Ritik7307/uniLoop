import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroScroll } from "@/components/landing/HeroScroll";
import { UniLoopIntro } from "@/components/landing/UniLoopIntro";
import { ExplainerVideo } from "@/components/landing/ExplainerVideo";
import { CampusProblem } from "@/components/landing/CampusProblem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LostAndFound } from "@/components/landing/LostAndFound";
import { MarketplacePreview } from "@/components/landing/MarketplacePreview";
import { CommunitySection } from "@/components/landing/CommunitySection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <HeroScroll />
      <UniLoopIntro />
      <ExplainerVideo />
      <CampusProblem />
      <HowItWorks />
      <LostAndFound />
      <MarketplacePreview />
      <CommunitySection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
