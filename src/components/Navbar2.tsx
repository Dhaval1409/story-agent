"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar2() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-red-600/20">
            <span className="text-white font-black text-xl">D</span>
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase text-white">
            Drama<span className="text-amber-500">Agent</span>
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.1em]">
          <Link 
            href="/" 
            className={`transition-colors ${pathname === "/" ? "text-amber-500" : "text-zinc-400 hover:text-white"}`}
          >
            Home
          </Link>
          <Link 
            href="/story-agent" 
            className={`transition-colors ${pathname === "/story-agent" ? "text-amber-500" : "text-zinc-400 hover:text-white"}`}
          >
            Director Styles
          </Link>
          
          {/* NEW DRAMA AGENT LINK - Replaced Archive */}
          <Link 
            href="/drama" 
            className={`transition-colors ${pathname === "/drama" ? "text-amber-500" : "text-zinc-400 hover:text-white"}`}
          >
            Drama Studio
          </Link>
        </div>

        {/* ACTION BUTTON */}
        <div className="flex items-center gap-4">
          <Link href="/drama">
            <button className="px-5 py-2 bg-white text-black text-[10px] font-black rounded-full hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest active:scale-95">
              {pathname === "/drama-agent" ? "New Script" : "Open Studio"}
            </button>
          </Link>
        </div>
        
      </div>
    </nav>
  );
}