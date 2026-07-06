import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import SlantedDivider from "../components/SlantedDivider";
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
            <div className="border-x border-zinc-800 flex flex-col flex-grow min-w-0 overflow-x-hidden bg-black z-10">
                <Navbar />
                <HeroSection />
                <SlantedDivider />
                <DemoSection />
                <SlantedDivider />
                <MockInterviewSection />
                <SlantedDivider />
                <FeatureGridSection />
                <SlantedDivider />
                <TestimonialsSection />
                <SlantedDivider />
                <FooterSection />
            </div>

            {/* Right Section */}
            <div className="hidden lg:block">
            </div>
        </div>
    );
};

export default LandingPage;
