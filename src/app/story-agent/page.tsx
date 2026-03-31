"use client";

import { useState } from "react";

const parseCinematicOutput = (text: string) => {
  if (!text) return { subjects: "", scenes: "", prompts: "" };
  const sections = {
    subjects: text.split(/PHASE 2/i)[1]?.split(/PHASE 3/i)[0] || "",
    scenes: text.split(/PHASE 3/i)[1]?.split(/PHASE 4/i)[0] || "",
    prompts: text.split(/PHASE 4/i)[1] || "",
  };
  return sections;
};

export default function StoryAgentPage() {
  const [idea, setIdea] = useState("");
  const [director, setDirector] = useState("");
  const [language, setLanguage] = useState("English");
  const [narration, setNarration] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!idea.trim() || !director || loading) {
      alert("Please enter a vision and select a director.");
      return;
    }
    setLoading(true);
    setOutput("");
    setNarration("");
    try {
      const storyRes = await fetch("/api/story-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, director, language }),
      });
      const storyData = await storyRes.json();
      if (!storyData.text || storyData.text.toLowerCase().includes("provide a story idea first")) {
        alert("The AI needs a more detailed idea.");
        setLoading(false);
        return;
      }
      setNarration(storyData.text);
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `ACT AS A CINEMATOGRAPHER. Base on: "${storyData.text}". Generate PHASE 2, 3, and 4.` }],
        }),
      });
      const chatData = await chatRes.json();
      setOutput(chatData.text);
      setActiveTab(1);
    } catch (error) {
      alert("Production halted.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const data = parseCinematicOutput(output);

  return (
    // Added pt-32 to ensure content starts well below the fixed navbar
    <div className="min-h-screen bg-[#050505] text-zinc-300 pt-32 pb-20 px-4 md:px-8 selection:bg-amber-500/30">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* HEADER / TITLE SECTION */}
        <div className="text-center space-y-2 mb-12">
            <h2 className="text-amber-500 font-mono text-[10px] uppercase tracking-[0.4em] font-black">Production Console</h2>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">Direct Your Vision</h1>
        </div>

        {/* INPUT CONSOLE */}
        <section className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-zinc-800 rounded-[2rem] blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-zinc-900/90 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-[2rem] shadow-2xl">
            <textarea
              className="w-full bg-transparent text-white text-xl md:text-2xl placeholder:text-zinc-700 outline-none h-32 resize-none mb-8 font-light italic leading-snug"
              placeholder="Describe the cinematic atmosphere..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />

            <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-white/5">
              <div className="flex gap-3 flex-grow">
                <select
                  className="bg-zinc-800/50 border border-zinc-700/50 text-[10px] font-bold uppercase tracking-widest px-5 py-3 rounded-full text-zinc-300 outline-none focus:border-amber-500/50 transition-all cursor-pointer"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                >
                  <option value="">Style: Select Director</option>
                  <option>Christopher Nolan</option>
                  <option>Quentin Tarantino</option>
                  <option>Denis Villeneuve</option>
                  <option>Wes Anderson</option>
                  <option>David Fincher</option>
                </select>

                <select
                  className="bg-zinc-800/50 border border-zinc-700/50 text-[10px] font-bold uppercase tracking-widest px-5 py-3 rounded-full text-zinc-300 outline-none focus:border-amber-500/50 transition-all cursor-pointer"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>English</option>
                  <option>Hindi (Devanagari)</option>
                  <option>Hinglish (Roman)</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`px-12 py-3 rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-all
                  ${loading 
                    ? "bg-zinc-800 text-zinc-600 animate-pulse" 
                    : "bg-white text-black hover:bg-amber-500 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"}`}
              >
                {loading ? "Processing..." : "Action 🎬"}
              </button>
            </div>
          </div>
        </section>

        {/* OUTPUT AREA */}
        {(narration || output) && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            
            {/* MINIMALIST TABS */}
            <nav className="flex flex-wrap justify-center gap-2 p-1 bg-zinc-900/50 border border-white/5 rounded-full max-w-fit mx-auto backdrop-blur-md">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setActiveTab(num)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                    ${activeTab === num
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                        : "text-zinc-500 hover:text-zinc-200"
                    }`}
                >
                  {["Script", "Subject", "Library", "Prompts"][num - 1]}
                </button>
              ))}
            </nav>

            <div className="min-h-[400px]">
              {/* TAB 1: SCRIPT */}
              {activeTab === 1 && (
                <div className="bg-zinc-900/30 border border-white/5 p-12 md:p-20 rounded-[3rem] relative overflow-hidden group">
                  <div className="absolute top-8 right-10">
                    <button onClick={() => handleCopy(narration, "n")} className="text-[10px] font-bold text-zinc-600 hover:text-amber-500 transition uppercase tracking-tighter">
                      {copyStatus === "n" ? "✓ Recorded" : "Copy Script"}
                    </button>
                  </div>
                  <p className="text-xl md:text-4xl leading-[1.6] text-white font-serif italic text-center max-w-4xl mx-auto opacity-90">
                    "{narration}"
                  </p>
                  <div className="mt-12 flex justify-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-amber-500/40" />
                    <div className="h-1 w-12 rounded-full bg-amber-500/20" />
                    <div className="h-1 w-1 rounded-full bg-amber-500/40" />
                  </div>
                </div>
              )}

              {/* TAB 2: SUBJECT */}
              {activeTab === 2 && (
                <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[2rem] max-w-4xl mx-auto shadow-inner">
                  <div className="text-sm leading-relaxed text-zinc-400 whitespace-pre-wrap font-mono">
                    {data.subjects || "Developing visual metadata..."}
                  </div>
                </div>
              )}

              {/* TAB 3: LIBRARY */}
              {activeTab === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.scenes.split(/Scene \d+:/i).filter((s) => s.trim().length > 10).map((scene, i) => (
                    <div key={i} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2rem] hover:bg-zinc-800/40 hover:border-amber-500/20 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Shot 0{i + 1}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-200 transition-colors">
                        {scene.trim()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: PROMPTS */}
              {activeTab === 4 && (
                <div className="space-y-4 max-w-4xl mx-auto">
                  {data.prompts.split(/PROMPT \d+/i).filter((p) => p.trim().length > 50).map((prompt, i) => (
                    <div key={i} className="group relative bg-zinc-900/80 border border-white/5 p-8 rounded-3xl hover:border-amber-500/30 transition-all">
                      <button onClick={() => handleCopy(prompt.trim(), `p-${i}`)}
                        className="absolute top-6 right-8 text-[9px] font-black bg-white/5 text-zinc-500 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-amber-500 hover:text-black">
                        {copyStatus === `p-${i}` ? "COPIED" : "COPY PROMPT"}
                      </button>
                      <span className="text-zinc-600 text-[10px] font-black block mb-2 uppercase tracking-[0.2em]">Midjourney Engine v6.0</span>
                      <p className="text-[13px] font-mono leading-relaxed text-zinc-300 pr-10">
                        {prompt.trim()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 