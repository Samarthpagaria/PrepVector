import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import SectionDivider from "../components/SectionDivider";
import DemoSection from "../components/DemoSection";
import MockInterviewSection from "../components/MockInterviewSection";
import FeatureGridSection from "../components/FeatureGridSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FooterSection from "../components/FooterSection";

const LandingPage = () => {
    return (
        <div className="min-h-screen w-full bg-black text-white font-mono grid grid-cols-[1fr_2fr_1fr]">
            {/* Left Section */}
            <div className="hidden lg:block">
            </div>

            {/* Middle Section */}
            <div className="border-x border-zinc-800 flex flex-col flex-grow min-w-0 overflow-clip bg-black z-10">
                <Navbar />
                <HeroSection />
                <SectionDivider />
                <DemoSection />
                <SectionDivider />
                <MockInterviewSection />
                <SectionDivider />
                <FeatureGridSection />
                <SectionDivider />
                <TestimonialsSection />
                <SectionDivider />
                <FooterSection />
            </div>

            {/* Right Section */}
            <div className="hidden lg:block">
            </div>

            {/* Premium Progressive Bottom Glass Fade Overlay */}
            <div className="fixed bottom-0 left-0 w-full h-20 md:h-24 pointer-events-none z-50 select-none">
                {/* Progressive Blur Layers for buttery smooth falloff */}
                <div className="absolute inset-0 backdrop-blur-[1px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_12.5%)]" />
                <div className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,transparent_12.5%,black_25%)]" />
                <div className="absolute inset-0 backdrop-blur-[3px] [mask-image:linear-gradient(to_bottom,transparent_25%,black_37.5%)]" />
                <div className="absolute inset-0 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,transparent_37.5%,black_50%)]" />
                <div className="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,transparent_50%,black_62.5%)]" />
                <div className="absolute inset-0 backdrop-blur-[8px] [mask-image:linear-gradient(to_bottom,transparent_62.5%,black_75%)]" />
                <div className="absolute inset-0 backdrop-blur-[12px] [mask-image:linear-gradient(to_bottom,transparent_75%,black_87.5%)]" />
                <div className="absolute inset-0 backdrop-blur-[16px] [mask-image:linear-gradient(to_bottom,transparent_87.5%,black_100%)]" />
                
                {/* Gradient overlay for darkening and slight white frost tone */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/95" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-white/[0.03]" />
            </div>
        </div>
    );
};

export default LandingPage;
