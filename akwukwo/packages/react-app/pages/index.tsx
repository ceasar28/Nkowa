import HeroSection from "../components/Hero";
import RemixIDESection from "../components/HowItWorks";
import FooterSection from "../components/downsection";

export default function Home() {
  return (
    <div>
      <div className="h1">
        <HeroSection />
        <RemixIDESection />
        <FooterSection />
      </div>
    </div>
  );
}
