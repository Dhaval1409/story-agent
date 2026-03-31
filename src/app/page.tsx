import React from 'react';
import Link from 'next/link';
const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500/30">
      {/* --- NAV BAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-xl">S</span>
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase">StoryAgent</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition">Director Styles</a>
            <a href="#" className="hover:text-white transition">Production Bible</a>
            <a href="#" className="hover:text-white transition">API</a>
          </div>
          <Link href="/story-agent">
          <button className="px-5 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-amber-500 transition-colors uppercase tracking-widest">
            Enter Studio
          </button>
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Abstract Background Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-amber-500/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            AI Cinematography Engine
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8">
            FROM BLANK PAGE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
              TO BOX OFFICE.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl leading-relaxed mb-12 font-light">
            Generate complete production bibles in seconds. Our AI acts as your Lead Cinematographer, 
            turning simple visions into detailed scripts, scene libraries, and visual prompts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-4 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 hover:scale-105 transition-all uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              Start Directing 🎬
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all uppercase tracking-widest text-sm">
              Watch Demo
            </button>
          </div>
        </div>
      </header>

      {/* --- FEATURE GRID (Phase Logic) --- */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FeatureCard 
            phase="01" 
            title="Narrative Script" 
            desc="AI-driven voiceover narration tailored to specific directorial voices like Nolan or Tarantino."
          />
          <FeatureCard 
            phase="02" 
            title="Subject Bible" 
            desc="Deep analysis of character aesthetics, clothing textures, and visual identity."
          />
          <FeatureCard 
            phase="03" 
            title="Scene Library" 
            desc="Structured breakdown of every shot, including camera angles and emotional beats."
          />
          <FeatureCard 
            phase="04" 
            title="Visual Prompts" 
            desc="High-fidelity prompts ready for Midjourney or Stable Diffusion generation."
          />
        </div>
      </section>

      {/* --- PREVIEW SECTION --- */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[3rem] p-4 md:p-8 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 mb-6 px-4">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                </div>
                <div className="ml-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Cinematography Console v1.0</div>
            </div>
            {/* Simulating your UI */}
            <div className="space-y-4 opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700">
                <div className="h-20 bg-black/40 rounded-2xl border border-zinc-800" />
                <div className="grid grid-cols-4 gap-4">
                    <div className="h-10 bg-amber-500/10 rounded-full border border-amber-500/20" />
                    <div className="h-10 bg-zinc-800/40 rounded-full border border-zinc-800" />
                    <div className="h-10 bg-zinc-800/40 rounded-full border border-zinc-800" />
                    <div className="h-10 bg-zinc-800/40 rounded-full border border-zinc-800" />
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

type FeatureCardProps = {
  phase: number;
  title: string;
  desc: string;
};

const FeatureCard = ({ phase, title, desc }: FeatureCardProps) => (
  <div className="p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-3xl hover:border-amber-500/40 hover:bg-zinc-900/40 transition-all group">
    <div className="text-amber-500 font-mono text-xs font-black mb-4 group-hover:tracking-widest transition-all">
      PHASE {phase}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default HomePage;