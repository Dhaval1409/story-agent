"use client";

import React, { useState } from "react";
import { Play, Users, BookOpen, PenTool, Sparkles, Clipboard, Languages, Clock } from "lucide-react";

export default function DramaAgent() {
  const [topic, setTopic] = useState("");
  const [charCount, setCharCount] = useState(4);
  const [language, setLanguage] = useState("hinglish");
  const [duration, setDuration] = useState(10);
  const [loading, setLoading] = useState(false);
  const [scriptText, setScriptText] = useState(""); // Changed from JSON to String

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/drama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, charCount, language, duration }),
      });
      const data = await res.json();
      setScriptText(data.text);
    } catch (err) {
      alert("Error generating script.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-300 pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest italic">
            <Sparkles size={12} /> AI Drama Scriptwriter
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase italic">Drama Agent</h1>
        </div>

        {/* CONTROLS */}
        <section className="bg-zinc-900/40 border border-white/5 p-6 md:p-10 rounded-[2.5rem] backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 px-2"><PenTool size={14} className="text-red-500" /> Topic</label>
              <input type="text" placeholder="e.g. Save Water, Women Empowerment..." className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-500/50 transition-all" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 px-2"><Languages size={14} className="text-red-500" /> Language</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white outline-none" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="hinglish">Hinglish</option>
                  <option value="hindi">Hindi</option>
                  <option value="english">English</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 px-2"><Users size={14} className="text-red-500" /> Cast</label>
                <input type="number" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white outline-none" value={charCount} onChange={(e) => setCharCount(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 px-2"><Clock size={14} className="text-red-500" /> Performance Duration: {duration} Mins</label>
            <input type="range" min="5" max="30" step="5" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none accent-red-600 cursor-pointer" />
          </div>

          <button onClick={handleGenerate} disabled={loading || !topic} className="w-full mt-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm bg-red-600 text-white hover:bg-red-500 transition-all shadow-xl shadow-red-600/20">
            {loading ? "COMMISSIONING SCRIPT..." : "GENERATE THEATRE SCRIPT"}
          </button>
        </section>

        {/* OUTPUT AREA */}
        {scriptText && (
          <div className="bg-[#fdfdfd] text-zinc-900 p-8 md:p-16 rounded-[3rem] shadow-2xl font-serif whitespace-pre-wrap leading-relaxed relative selection:bg-red-200">
            <button 
              onClick={() => navigator.clipboard.writeText(scriptText)} 
              className="absolute top-8 right-8 text-zinc-400 hover:text-red-600 transition flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest"
            >
              <Clipboard size={14} /> Copy Script
            </button>
            
            <div className="max-w-2xl mx-auto text-lg md:text-xl">
              {scriptText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}