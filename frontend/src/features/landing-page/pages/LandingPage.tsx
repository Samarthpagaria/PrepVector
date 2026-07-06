import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import SlantedDivider from "../components/SlantedDivider";
import DemoSection from "../components/DemoSection";
import MockInterviewSection from "../components/MockInterviewSection";
import FeatureGridSection from "../components/FeatureGridSection";
import WhyPrepVectorSection from "../components/WhyPrepVectorSection";

const LandingPage = () => {
    return (
        <div className="min-h-screen w-full bg-black text-white font-mono grid grid-cols-[1fr_2fr_1fr]">
            {/* Left Section */}
            <div className="border-r border-slate-200/60">
            </div>

            {/* Middle Section */}
            <div className="border border-gray-800 flex flex-col flex-grow">
                <Navbar />
                <HeroSection />
                <SlantedDivider />
                <DemoSection />
                <MockInterviewSection />
                <FeatureGridSection />
                <WhyPrepVectorSection />
            </div>

            {/* Right Section */}
            <div className="border-l  border-slate-200/60">
            </div>
        </div>
    );
};

export default LandingPage;
