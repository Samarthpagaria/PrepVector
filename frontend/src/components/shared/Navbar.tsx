import React from 'react';
import { Link } from 'react-router'; // or react-router-dom depending on setup, but user used react-router in app.routes.tsx

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md px-4 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/app" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            PrepVector
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {/* User profile / actions can go here later */}
          <div className="h-8 w-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-sm font-medium text-zinc-600">
            U
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
