import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
