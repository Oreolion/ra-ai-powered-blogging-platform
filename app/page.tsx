import HeroV2 from "@/components/HeroV2";
import StatsSection from "@/components/StatsSection";
import FeaturesShowcase from "@/components/FeaturesShowcase";
import CTASection from "@/components/CTASection";
import FooterV2 from "@/components/FooterV2";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#333]">
      <Navbar />
      <HeroV2 />
      <StatsSection />
      <FeaturesShowcase />
      <CTASection />
      <FooterV2 />
    </main>
  );
}
