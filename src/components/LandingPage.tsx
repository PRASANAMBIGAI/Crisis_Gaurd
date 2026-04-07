"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  LayoutDashboard, 
  Map, 
  Globe, 
  Scale, 
  FileCode2, 
  Newspaper,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LandingPageProps {
  onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-x-hidden scroll-smooth selection:bg-[#2B8DF8] selection:text-white">
      <main className="flex-1 flex flex-col relative z-10 w-full bg-white">
        
        {/* =========================================
            HEADER NAV
        ========================================= */}
        <header className="flex justify-between items-center px-6 md:px-12 py-6 z-50 w-full sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="font-black text-2xl text-slate-900 tracking-tighter flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <ShieldAlert className="w-7 h-7 text-[#2B8DF8]" />
            CrisisGuard
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-[#2B8DF8] transition-colors">Features</a>
            <a href="#dashboard" className="text-sm font-semibold text-slate-600 hover:text-[#2B8DF8] transition-colors">Dashboard</a>
            <a href="#map" className="text-sm font-semibold text-slate-600 hover:text-[#2B8DF8] transition-colors">Threat Map</a>
            <a href="#policies" className="text-sm font-semibold text-slate-600 hover:text-[#2B8DF8] transition-colors">Policies</a>
            <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-[#2B8DF8] transition-colors">About Us</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold hidden sm:flex"
              onClick={onLoginClick}
            >
              Login
            </Button>
            <Button 
              className="rounded-full bg-[#2B8DF8] hover:bg-[#1a6edb] text-white font-bold px-6 shadow-md shadow-blue-500/20"
              onClick={onLoginClick}
            >
              Sign In
            </Button>
          </div>
        </header>

        {/* =========================================
            1. HERO SECTION
        ========================================= */}
        <section className="relative pt-24 md:pt-32 pb-32 px-4 flex flex-col items-center justify-center overflow-hidden min-h-[85vh]">
          {/* Background Network Graphic Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50 z-0">
            <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-blue-100/50 absolute top-[10%] blur-[100px]" />
            <svg className="w-full h-full max-w-6xl mx-auto absolute top-0" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin slice">
              <path d="M100 350 L250 200 L400 380 L600 250 L800 400 L950 220" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-40" />
              <path d="M150 450 L300 500 L450 480 L550 550 L750 490 L850 540" stroke="#3b82f6" strokeWidth="1.5" className="opacity-50" />
              <path d="M250 200 L300 500 L600 250 L750 490 L950 220" stroke="#3b82f6" strokeWidth="0.5" className="opacity-30" />
              <path d="M400 380 L450 480 L600 250 L550 550" stroke="#3b82f6" strokeWidth="0.5" className="opacity-20" />
              <path d="M100 350 L150 450" stroke="#3b82f6" strokeWidth="1" className="opacity-30" />
              <path d="M800 400 L850 540" stroke="#3b82f6" strokeWidth="1" className="opacity-30" />
              
              <g fill="#2B8DF8">
                <circle cx="100" cy="350" r="6" className="drop-shadow-[0_0_8px_rgba(43,141,248,0.8)]" />
                <circle cx="250" cy="200" r="5" className="opacity-60" />
                <circle cx="400" cy="380" r="8" className="drop-shadow-[0_0_10px_rgba(43,141,248,1)]" />
                <circle cx="600" cy="250" r="4" className="opacity-80" />
                <circle cx="800" cy="400" r="7" className="drop-shadow-[0_0_8px_rgba(43,141,248,0.8)]" />
                <circle cx="950" cy="220" r="5" className="opacity-60" />
                <circle cx="150" cy="450" r="6" className="drop-shadow-[0_0_8px_rgba(43,141,248,0.8)]" />
                <circle cx="300" cy="500" r="4" className="opacity-70" />
                <circle cx="450" cy="480" r="5" className="opacity-70" />
                <circle cx="550" cy="550" r="6" className="drop-shadow-[0_0_8px_rgba(43,141,248,0.8)]" />
                <circle cx="750" cy="490" r="4" className="opacity-70" />
                <circle cx="850" cy="540" r="5" className="drop-shadow-[0_0_8px_rgba(43,141,248,0.8)]" />
              </g>
            </svg>
          </div>

          <div className="z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              AI-Driven Triage for <br />
              <span className="text-[#2B8DF8]">Active Crises.</span>
            </h1>
            <p className="mt-8 text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
              Protect your platform when it matters most. CrisisGuard is an automated Trust & Safety environment that predicts, verifies, and mitigates the harm of misinformation in real-time.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button 
                className="rounded-full bg-[#2B8DF8] hover:bg-[#1a6edb] text-white px-8 py-6 text-lg font-bold shadow-xl shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:-translate-y-1"
                onClick={onLoginClick}
              >
                View Live Dashboard
              </Button>
              <Button 
                variant="outline"
                className="rounded-full border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-8 py-6 text-lg font-bold shadow-sm transition-all hover:-translate-y-1 flex items-center gap-2"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <FileCode2 className="w-5 h-5" />
                Read the Spec
              </Button>
            </div>
          </div>
        </section>

        {/* =========================================
            2. THE PROBLEM STATEMENT
        ========================================= */}
        <section className="py-24 px-6 bg-slate-50 border-y border-slate-100 flex justify-center">
          <div className="max-w-3xl text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              The speed of crisis outpaces human review.
            </h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
              During an active crisis, social media platforms are flooded with real-time reports. Human moderators are quickly overwhelmed by the volume, making it nearly impossible to separate life-saving civic broadcasts from dangerous, coordinated misinformation. <strong className="text-slate-900 font-bold">Delaying action on high-harm content costs lives, while over-censoring restricts vital communication.</strong>
            </p>
          </div>
        </section>

        {/* =========================================
            3. CORE FEATURES (How It Works)
        ========================================= */}
        <section id="features" className="py-32 px-6 max-w-7xl mx-auto w-full">
          <div className="text-center mb-20">
            <Badge text="Capabilities" />
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-6">
              Proactive Threat Intelligence.
            </h2>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto font-medium">
              The technical foundation of our MVP. Breaking down exactly how CrisisGuard filters the noise and prioritizes real impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-[#2B8DF8]" />}
              title="Automated Level-1 Triage"
              desc="Our AI agent instantly categorizes incoming tickets, separating obvious spam from complex, context-heavy threats, allowing human moderators to focus on edge cases."
            />
            <FeatureCard 
              icon={<ShieldAlert className="w-6 h-6 text-[#2B8DF8]" />}
              title="Dynamic Harm Indexing"
              desc="Not all misinformation is equal. CrisisGuard evaluates the contextual severity of a post, heavily weighing false positives and prioritizing high-harm tickets for immediate escalation."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="w-6 h-6 text-[#2B8DF8]" />}
              title="Real-Time Fact-Check"
              desc="Before taking destructive action, the system autonomously queries a verified knowledge base to gather context, mimicking the multi-step reasoning of a real Trust & Safety analyst."
            />
          </div>
        </section>

        {/* =========================================
            4. DASHBOARD PREVIEW
        ========================================= */}
        <section id="dashboard" className="py-32 px-6 bg-slate-900 text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8 z-10">
              <Badge text="Workspace" light />
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                The Operational Command Center.
              </h2>
              <p className="text-lg text-slate-400 font-medium leading-relaxed">
                Enter the live queue. The CrisisGuard Dashboard is designed for rapid decision-making under pressure.
              </p>
              
              <ul className="space-y-6">
                <ListItem title="Automated Harm Indexing" text="Every incoming report is instantly scored based on contextual severity and threat level." />
                <ListItem title="One-Click Triage" text="Seamlessly allow, warn, delete, or escalate tickets using an intuitive, distraction-free interface." />
                <ListItem title="Fact-Check Integration" text="Query our verified knowledge base directly from the ticket view to ensure accurate, context-aware enforcement." />
              </ul>
              
              <Button onClick={onLoginClick} className="mt-8 rounded-full bg-[#2B8DF8] hover:bg-blue-400 text-white font-bold px-8 py-6">
                 Try the Dashboard
              </Button>
            </div>

            {/* Abstract UI Placeholder */}
            <div className="relative h-[500px] rounded-[32px] bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden flex flex-col z-10 group">
              <div className="h-14 border-b border-slate-700 bg-slate-800/50 flex items-center px-6 gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <div className="ml-4 h-4 w-48 bg-slate-700 rounded-full"></div>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-4 relative">
                <div className="absolute right-0 top-1/4 w-64 h-64 bg-[#2B8DF8]/20 rounded-full blur-[80px] group-hover:bg-[#2B8DF8]/30 transition-all duration-700" />
                <div className="flex gap-4">
                  <div className="w-1/3 h-24 bg-slate-700/50 rounded-2xl border border-slate-600/50"></div>
                  <div className="w-1/3 h-24 bg-slate-700/50 rounded-2xl border border-slate-600/50"></div>
                  <div className="w-1/3 h-24 bg-[#2B8DF8]/20 rounded-2xl border border-[#2B8DF8]/30"></div>
                </div>
                <div className="flex-1 bg-slate-700/30 rounded-2xl border border-slate-600/30 p-4 space-y-3">
                  <div className="h-6 w-32 bg-slate-600/50 rounded-md"></div>
                  <div className="w-full h-px bg-slate-600/30"></div>
                  {[1,2,3,4].map(i => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                        <div className="space-y-1">
                          <div className="h-3 w-24 bg-slate-600 rounded-full"></div>
                          <div className="h-2 w-48 bg-slate-700 rounded-full"></div>
                        </div>
                      </div>
                      <div className="h-6 w-16 bg-[#2B8DF8]/20 rounded-full border border-[#2B8DF8]/30"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================
            5. THREAT MAP
        ========================================= */}
        <section id="map" className="py-32 px-6 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Map Visual Placeholder */}
            <div className="relative h-[500px] rounded-[32px] bg-slate-100 border border-slate-200 shadow-xl overflow-hidden shadow-blue-500/5 order-2 lg:order-1 flex items-center justify-center">
              <Globe className="absolute w-full h-full text-blue-100/50 scale-150 stroke-[0.5]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 to-transparent z-10" />
              <div className="relative z-20 w-3/4 aspect-video bg-white rounded-2xl shadow-lg border border-slate-200 p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div className="h-3 w-24 bg-slate-200 rounded-full"></div>
                  <Map className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 relative bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                  <div className="absolute top-[30%] left-[20%] w-12 h-12 bg-rose-500/20 rounded-full animate-ping" />
                  <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
                  <div className="absolute top-[60%] left-[60%] w-8 h-8 bg-amber-500/20 rounded-full animate-ping" />
                  <div className="absolute top-[60%] left-[60%] w-2 h-2 bg-amber-500 rounded-full border border-white shadow-sm" />
                  <div className="absolute top-[40%] right-[10%] w-3 h-3 bg-emerald-500 rounded-full border border-white shadow-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <Badge text="Telemetry" />
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Visualize the Threat Landscape.
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Misinformation doesn't happen in a vacuum. The Threat Map provides a real-time, geographical, and contextual visualization of emerging narratives.
              </p>
              
              <ul className="space-y-6">
                <ListItem light title="Predictive Tracking" text="Spot coordinated disinformation campaigns and bot networks before they reach viral velocity." />
                <ListItem light title="Crisis Hotspots" text="Monitor specific regions or topics experiencing sudden spikes in high-severity reports." />
                <ListItem light title="Resource Allocation" text="Dynamically route human moderation power to the narratives causing the most immediate real-world harm." />
              </ul>
            </div>

          </div>
        </section>

        {/* =========================================
            6. POLICIES
        ========================================= */}
        <section id="policies" className="py-32 px-6 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
              <Badge text="Governance" />
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Transparent Rules of Engagement.
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Effective moderation requires consistent standards. CrisisGuard operates strictly within established Trust & Safety frameworks.
              </p>
              
              <ul className="space-y-6">
                <ListItem light title="Algorithmic Transparency" text="Understand exactly why the AI flagged a post, with clear reasoning logs attached to every automated decision." />
                <ListItem light title="Balancing Act" text="Our models are specifically tuned to heavily penalize false positives—protecting vital civic broadcasts and free expression while neutralizing genuine threats." />
                <ListItem light title="Dynamic Rule Updates" text="Rapidly deploy new policy parameters as a crisis evolves, ensuring the AI agent adapts to shifting real-world contexts." />
              </ul>
            </div>

            {/* Policy UI Abstract */}
            <div className="relative h-[500px] rounded-[32px] bg-white border border-slate-200 shadow-xl overflow-hidden p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Scale className="w-8 h-8 text-[#2B8DF8]" />
                  <div>
                    <div className="h-4 w-32 bg-slate-800 rounded-md mb-2"></div>
                    <div className="h-3 w-48 bg-slate-200 rounded-md"></div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">ACTIVE</div>
              </div>
              
              <div className="flex-1 space-y-4">
                {[1,2].map(i => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex justify-between">
                      <div className="h-3 w-40 bg-slate-300 rounded-full"></div>
                      <div className="h-3 w-10 bg-[#2B8DF8]/50 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                      <div className="h-2 w-5/6 bg-slate-200 rounded-full"></div>
                      <div className="h-2 w-4/6 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* =========================================
            7. ABOUT US (The Vision)
        ========================================= */}
        <section id="about" className="py-32 px-6 bg-slate-900 border-t border-slate-800 flex justify-center text-center">
          <div className="max-w-4xl space-y-8">
            <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-[#2B8DF8]">
              Built for Public Good
            </h4>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Bridging Cybersecurity <br/> and Social Impact.
            </h2>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
              CrisisGuard was built to solve a critical vulnerability in modern information flow. We believe that combining robust software engineering principles with intelligent threat modeling can fundamentally change how we handle digital emergencies. Our mission is to build highly efficient, scalable moderation environments that empower human teams with advanced, automated intelligence—keeping platforms safe without sacrificing speed or context.
            </p>
          </div>
        </section>

        {/* =========================================
            8. FOOTER
        ========================================= */}
        <footer className="bg-slate-950 py-16 border-t border-slate-800 text-slate-400">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 font-bold text-white tracking-tight">
              <ShieldAlert className="w-5 h-5 text-[#2B8DF8]" />
              CrisisGuard
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium">
              <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <Github className="w-4 h-4" /> GitHub Repository
              </a>
              <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <Terminal className="w-4 h-4" /> OpenEnv YAML
              </a>
              <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <FileCode2 className="w-4 h-4" /> Baseline Script
              </a>
              <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <Newspaper className="w-4 h-4" /> Contact Team
              </a>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}

// -----------------------------
// Helper Presentation Components
// -----------------------------

function Badge({ text, light = false }: { text: string, light?: boolean }) {
  return (
    <span className={cn(
      "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-4 border",
      light 
        ? "bg-[#2B8DF8]/10 text-[#2B8DF8] border-[#2B8DF8]/20" 
        : "bg-blue-50 text-[#2B8DF8] border-blue-100"
    )}>
      {text}
    </span>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function ListItem({ title, text, light = false }: { title: string, text: string, light?: boolean }) {
  return (
    <li className="flex gap-4">
      <div className={cn("mt-1 shrink-0", light ? "text-slate-400" : "")}>
        <CheckCircle2 className={cn("w-6 h-6", light ? "text-[#2B8DF8]" : "text-[#2B8DF8]")} />
      </div>
      <div>
        <h4 className={cn("text-xl font-bold mb-1", light ? "text-slate-800" : "text-white")}>{title}</h4>
        <p className={cn("font-medium", light ? "text-slate-500" : "text-slate-400")}>{text}</p>
      </div>
    </li>
  );
}
