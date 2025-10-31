// pages/landingpage/index.tsx
import HeroSection from "@/components/landingpage/HeroSection";
import FeaturesSection from "@/components/landingpage/FeaturesSection";
import CTASection from "@/components/landingpage/CTASection";

export default function Home() {
  return (
    <main className="relative">
       <HeroSection /> 
      <FeaturesSection /> 
      <CTASection /> 
    </main>
  );
}
