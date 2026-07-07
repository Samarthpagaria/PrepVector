import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0c] font-sans text-zinc-100 flex flex-col relative overflow-hidden selection:bg-emerald-500/30">
      {/* Global Dashboard Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute left-0 right-0 top-[-10%] z-0 m-auto h-[300px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>

      <div className="relative z-50">
        <Navbar />
      </div>
      
      <main className="flex-1 w-full relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
