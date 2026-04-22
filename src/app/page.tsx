"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home as HomeIcon, 
  User as UserIcon, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Activity,
  History,
  Stethoscope,
  Settings,
  TrendingUp,
  AlertCircle,
  Microscope,
  Dna,
  LineChart,
  Play,
  Shield
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type SubScores = {
  metabolic: number;
  testosterone: number;
  cns: number;
};

type UserState = {
  overallRPI: number;
  subScores: SubScores;
  insightText: string;
  recommendedProductId: string;
};

// --- Constants ---
const OPTION_VALUES: Record<string, number> = {
  // Q1: mid-afternoon crash
  "Yes, multiple days": 65,
  "Once or twice": 80,
  "No, sustained energy": 96,
  
  // Q2: morning baseline
  "Absent/Weak": 65,
  "Inconsistent": 80,
  "Optimal": 96,
  
  // Q3: wake unprompted
  "Frequently": 65,
  "Occasionally": 80,
  "Slept through": 96,
  
  // Q4: physical grip/recovery
  "Noticeably weaker": 65,
  "Standard": 80,
  "Peaking": 96
};

const DEFAULT_STATE: UserState = {
  overallRPI: 78,
  subScores: { metabolic: 74, testosterone: 92, cns: 81 },
  insightText: "Your energy recovery is lagging behind your cohort. Pattern analysis suggests elevated cortisol. We recommend adding L-Theanine to your night stack.",
  recommendedProductId: "sleep"
};

// --- Components ---

const BackgroundGlows = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-600/10 rounded-full blur-[120px]" />
    <div className="absolute top-1/3 -right-32 w-80 h-80 bg-slate-400/10 rounded-full blur-[100px]" />
    <div className="absolute -bottom-24 left-1/4 w-72 h-72 bg-teal-800/10 rounded-full blur-[100px]" />
  </div>
);

const GlassCard = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <motion.div 
    whileHover={onClick ? { scale: 1.01 } : {}}
    whileTap={onClick ? { scale: 0.99 } : {}}
    onClick={onClick}
    className={cn(
      "bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] rounded-[2rem] overflow-hidden",
      className
    )}
  >
    {children}
  </motion.div>
);

const BottomNav = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'benchmark', icon: Activity, label: 'Insights' },
    { id: 'protocol', icon: Microscope, label: 'Protocol' },
    { id: 'care', icon: Shield, label: 'Care Team' },
  ];

  return (
    <nav className="absolute bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-100/50 px-6 py-3 pb-8 flex justify-between items-center z-20">
      {tabs.map((tab) => (
        <button 
          key={tab.id} 
          onClick={() => onTabChange(tab.id)}
          className="relative flex flex-col items-center gap-1.5 cursor-pointer group px-2"
        >
          <AnimatePresence>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="navIndicator"
                className="absolute -top-1 w-1.5 h-1.5 bg-teal-600 rounded-full shadow-[0_0_8px_rgba(13,148,136,0.6)]"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
          </AnimatePresence>
          <tab.icon 
            size={20} 
            className={cn(
              "transition-all duration-300",
              activeTab === tab.id ? "text-teal-600 scale-110" : "text-slate-400 group-hover:text-slate-500"
            )} 
          />
          <span className={cn(
            "text-[9px] font-bold tracking-tight uppercase transition-colors duration-300",
            activeTab === tab.id ? "text-teal-600" : "text-slate-400"
          )}>
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

const RPIScoreVisual = ({ score }: { score: number }) => {
  const size = 190;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size + 40, height: size + 40 }}>
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <div className="w-full h-px bg-slate-900" />
        <div className="h-full w-px bg-slate-900" />
        <div className="absolute w-40 h-40 border border-slate-900 rounded-full" />
      </div>

      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-[0_0_20px_rgba(13,148,136,0.1)]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#0d9488"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <span className="text-7xl font-black tracking-tighter text-slate-800 leading-none">
            {score}
          </span>
          <div className="flex items-center gap-1 mt-1 text-teal-600 font-black">
            <ShieldCheck size={12} />
            <span className="text-[10px] uppercase tracking-[0.2em]">Clinical Index</span>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-4 -left-4 bg-white/90 backdrop-blur-md border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2 z-10"
      >
        <TrendingUp size={12} className="text-teal-600" />
        <span className="text-[10px] font-bold text-slate-600">+2.4% vs Base</span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute bottom-10 -right-4 bg-white/90 backdrop-blur-md border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2 z-10"
      >
        <AlertCircle size={12} className="text-amber-500" />
        <span className="text-[10px] font-bold text-slate-600">Restoration Lag</span>
      </motion.div>
    </div>
  );
};

const MetricBar = ({ label, score, colorClass }: { label: string, score: number, colorClass: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
      <span>{label}</span>
      <span className="text-slate-800 font-black">{score}%</span>
    </div>
    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className={cn("h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.05)]", colorClass)}
      />
    </div>
  </div>
);

// --- View Components ---

const DashboardView = ({ state, onStartLab }: { state: UserState, onStartLab: () => void }) => (
  <div className="px-6 pt-10 pb-32 space-y-7 overflow-y-auto h-full scrollbar-hide relative z-10">
    <header className="flex justify-between items-center">
      <div className="space-y-0.5">
        <h1 className="text-xl font-black tracking-tight text-slate-800 uppercase italic">RxMen<span className="text-teal-600"> Intelligence</span></h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tuesday Diagnostic • April 23</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
        <img src="https://i.pravatar.cc/100?img=12" alt="Avatar" className="w-full h-full object-cover" />
      </div>
    </header>

    <div className="flex flex-col items-center pt-2">
      <RPIScoreVisual score={state.overallRPI} />
    </div>

    <GlassCard className="p-7 space-y-5 border-slate-100/50">
      <h3 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold text-center">Biometric Integrity Breakdown</h3>
      <div className="space-y-4">
        <MetricBar label="Metabolic & Stress" score={state.subScores.metabolic} colorClass="bg-teal-600" />
        <MetricBar label="Free Testosterone Proxy" score={state.subScores.testosterone} colorClass="bg-amber-500" />
        <MetricBar label="CNS Recovery" score={state.subScores.cns} colorClass="bg-teal-600" />
      </div>
    </GlassCard>

    <GlassCard className="p-6 bg-teal-900/5 border-teal-600/20 shadow-[0_8px_32px_rgba(13,148,136,0.05)]">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-lg">
          <BrainCircuit size={18} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-black text-teal-800 uppercase tracking-widest">AI Clinical Brief</h4>
            <span className="text-[8px] font-bold text-teal-600/60 uppercase tracking-widest">Verified by Dr. Singh</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            {state.insightText}
          </p>
        </div>
      </div>
    </GlassCard>

    <motion.button 
      whileTap={{ scale: 0.98 }}
      onClick={onStartLab}
      className="w-full bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
        <Dna size={80} />
      </div>
      <div className="flex items-center justify-between relative z-10">
        <div className="text-left">
          <div className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-1">Diagnostic Pending</div>
          <div className="text-lg font-bold tracking-tight">Sync Weekly Pulse</div>
        </div>
        <div className="p-3 bg-teal-600 rounded-full shadow-lg">
          <ArrowRight size={20} />
        </div>
      </div>
    </motion.button>
  </div>
);

const BenchmarkView = ({ state }: { state: UserState }) => {
  return (
    <div className="px-6 pt-10 pb-32 space-y-7 overflow-y-auto h-full scrollbar-hide relative z-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-black tracking-tighter text-slate-800">Clinical Benchmark</h1>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Cohort Intelligence Analysis</p>
      </header>

      <GlassCard className="p-7 space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="text-5xl font-black text-slate-800 tracking-tighter">{state.overallRPI}%</div>
            <div className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em]">Optimized Threshold</div>
          </div>
          <div className="flex -space-x-3 pb-1">
            {[1, 2, 3].map(i => (
              <img key={i} src={`https://i.pravatar.cc/100?img=${i+25}`} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="User" />
            ))}
            <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[8px] font-black text-white">25K+</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-slate-300 w-[40%]" />
            <div className="h-full bg-teal-600/30 w-[30%]" />
            <div className="h-full bg-teal-600 w-[30%]" />
          </div>
          <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Lagging</span>
            <span>Average</span>
            <span className="text-teal-600">Peak</span>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-4">
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black px-1">Predictive Trajectory</h3>
        <GlassCard className="p-6 border-teal-600/10 bg-gradient-to-br from-white to-teal-50/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-lg">
              <LineChart size={18} />
            </div>
            <div>
              <div className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Intelligence Forecast</div>
              <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">+14 Day Projection</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            Based on men with similar SHI profiles, maintaining your current <span className="text-teal-700 font-bold">Resilience Protocol</span> will push your Restoration Index into the Top 10% within 14 days.
          </p>
          
          <div className="mt-6 h-12 flex items-end gap-1.5 opacity-40">
            {[30, 45, 40, 55, 50, 65, 80, 75, 90, 95].map((h, i) => (
              <motion.div 
                key={i} 
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
                className="flex-1 bg-teal-600 rounded-t-sm" 
              />
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black px-1">Biological Trajectory <span className="text-teal-600/60 lowercase italic font-medium">(Beta)</span></h3>
        <GlassCard className="p-6">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6">Projecting long-term vitality based on your current {state.overallRPI} RPI baseline.</p>
          
          <div className="h-24 w-full relative border-b-2 border-teal-500/30 mb-12">
            <div 
              className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-teal-500/20 via-teal-500/5 to-transparent"
              style={{ clipPath: 'polygon(0 100%, 100% 30%, 100% 100%)' }}
            />
            
            <div className="absolute left-0 bottom-0 -translate-x-1/2 translate-y-1/2 flex flex-col items-center gap-2">
              <div className="w-4 h-4 bg-teal-500 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.8)] border-2 border-white z-10" />
              <div className="text-center absolute top-6 whitespace-nowrap">
                <div className="text-[10px] font-black text-slate-800 tracking-tight">Age 30 Baseline</div>
              </div>
            </div>

            <div className="absolute right-4 bottom-12 translate-x-1/2 flex flex-col items-center gap-2">
              <div className="w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)] border-2 border-white animate-pulse z-10" />
              <div className="text-center absolute top-6 whitespace-nowrap">
                <div className="text-[10px] font-black text-slate-800 tracking-tight">Age 45 Projection</div>
              </div>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium mt-16 border-t border-slate-50 pt-4">
            By maintaining this protocol, your compounding health index projects a <span className="inline-block px-2 py-1 bg-teal-50 text-teal-700 font-bold rounded-md text-[10px]">7-year biological age advantage</span> by age 45.
          </p>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black px-1">Comparative Diagnostics</h3>
        <div className="space-y-3">
          {[
            { label: 'Metabolic Stability', score: state.subScores.metabolic, baseline: 80 },
            { label: 'Testosterone Recovery', score: state.subScores.testosterone, baseline: 85 },
            { label: 'CNS Restoration', score: state.subScores.cns, baseline: 80 }
          ].map((item, i) => {
            const isTop = item.score >= item.baseline;
            return (
              <div key={i} className="bg-white p-5 rounded-[1.5rem] flex items-center justify-between border border-slate-100 shadow-sm">
                <div>
                  <div className="text-xs font-bold text-slate-800 tracking-tight">{item.label}</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isTop ? 'Stable' : 'Action Required'}</div>
                </div>
                <div className={cn("text-xs font-black tracking-tight", isTop ? "text-teal-600" : "text-rose-500")}>
                  {isTop ? 'Top 30%' : 'Bottom 15%'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ProtocolView = ({ state }: { state: UserState }) => (
  <div className="pb-32 h-full overflow-y-auto scrollbar-hide relative z-10">
    <div className="relative w-full h-[400px] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&w=800&q=80"
        alt="Confident RxMen"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-slate-50"></div>

      <div className="relative z-10 pt-64 px-6">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">Active Protocol</h1>
        <p className="text-teal-600 font-bold text-[10px] uppercase tracking-[0.2em]">Calibrated • Week 3 Restoration</p>
      </div>
    </div>

    <div className="px-7 -mt-6 space-y-6">
      <GlassCard className={cn(
        "p-6 border-teal-600/20 shadow-lg shadow-teal-900/5",
        state.recommendedProductId === 'ashwagandha' ? "bg-amber-50/50" : "bg-teal-50/80"
      )}>
        <div className="flex gap-4">
          <div className="p-3 rounded-2xl bg-teal-600 text-white shadow-lg h-fit">
            <Microscope size={20} />
          </div>
          <div className="space-y-2">
            <h4 className="text-[11px] font-black text-teal-900 uppercase tracking-widest">Protocol Intelligence</h4>
            <p className="text-[11px] text-teal-800/80 leading-relaxed font-semibold">
              {state.insightText}
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-4">
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black px-1">Prescribed Formulations</h3>
        <div className="space-y-3">
          {[
            {
              id: 'ashwagandha',
              name: 'Ashwagandha KSM-66',
              desc: 'Stress Response Management',
              price: '$29',
              lab: 'Third-party Verified',
              imgUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop'
            },
            {
              id: 'sleep',
              name: 'Rx Sleep Restoration',
              desc: 'Magnesium + L-Theanine Complex',
              price: '$34',
              lab: 'Physician Audited',
              imgUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop'
            }
          ].map((prod) => (
            <GlassCard 
              key={prod.id} 
              className={cn(
                "p-4 flex gap-5 border-white/80 transition-all duration-500",
                state.recommendedProductId === prod.id ? "ring-2 ring-teal-500/50 scale-[1.02] bg-white" : "opacity-80"
              )}
            >
              <div className="shrink-0">
                <img
                  src={prod.imgUrl}
                  alt={prod.name}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm border border-slate-100"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="space-y-1">
                  <div className="text-[8px] font-black text-teal-600 uppercase tracking-[0.2em]">{prod.lab}</div>
                  <h3 className="font-bold text-slate-800 text-sm tracking-tight leading-tight">{prod.name}</h3>
                  <p className="text-[10px] text-slate-400 font-medium leading-tight">{prod.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-black text-slate-800 text-xs">{prod.price}</span>
                  <button className="bg-slate-900 text-white text-[8px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-md active:scale-95 transition-all">Subscribe</button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md border border-slate-200/50 p-8 rounded-[2.5rem] text-center space-y-4 shadow-sm">
        <Stethoscope className="mx-auto text-slate-300" size={32} />
        <h3 className="text-base font-bold text-slate-800 tracking-tight">Need Clinical Guidance?</h3>
        <p className="text-xs text-slate-400 font-medium leading-relaxed px-4">Consult with our clinic-led health coaches to refine your protocol further.</p>
        <button className="text-[10px] font-black uppercase tracking-widest text-teal-600 border-b border-teal-600/20 pb-1">Speak to a Coach</button>
      </div>
    </div>
  </div>
);

const CareTeamView = ({ state }: { state: UserState }) => (
  <div className="px-6 pt-10 pb-32 space-y-8 overflow-y-auto h-full scrollbar-hide relative z-10">
    <header className="space-y-1">
      <h1 className="text-2xl font-black tracking-tighter text-slate-800">Your Clinical Team</h1>
      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Premium Concierge Medical Access</p>
    </header>

    <GlassCard className="p-6">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80" 
            alt="Dr. Arvind Sharma" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 leading-tight">Dr. Arvind Sharma</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Endocrinologist</p>
          <div className="flex items-center gap-1.5 pt-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase">Online • Reviewed Week 3 Lab</span>
          </div>
        </div>
      </div>
    </GlassCard>

    <div className="space-y-4">
      <h3 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black px-1">AI Escalation Status</h3>
      <GlassCard className="p-6 border-rose-100 bg-rose-50/10">
        <div className="flex gap-4 items-start">
          <div className="p-3 rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-900/10">
            <AlertCircle size={20} />
          </div>
          <div className="space-y-3">
            <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
              Your RPI metrics have shifted this week. The AI has flagged this for clinical review.
            </p>
            <button className="w-full bg-teal-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all">
              Send Data for Async Review
            </button>
            <p className="text-[9px] text-slate-400 font-medium leading-relaxed italic">
              No scheduling required. Dr. Sharma will review your 30-day RPI trends and send a secure voice-note adjustment within 24 hours.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>

    <div className="space-y-4">
      <h3 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black px-1">Recent Voice Notes</h3>
      <GlassCard className="p-5">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all">
            <Play size={18} fill="currentColor" />
          </button>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black text-slate-800">Protocol Adjustment</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">April 18 • 0:45s</span>
            </div>
            {/* Waveform graphic */}
            <div className="h-6 flex items-center gap-1 opacity-20">
              {[3, 5, 2, 8, 4, 6, 9, 3, 5, 2, 6, 4, 3, 7, 5, 2, 4, 8, 3, 5, 4, 6].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-900 rounded-full" style={{ height: `${h * 10}%` }} />
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>

    <div className="pt-4 border-t border-slate-100 space-y-3">
      <button className="w-full flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-3">
          <History className="text-slate-400" size={18} />
          <span className="text-xs font-bold text-slate-600">Review Prescription History</span>
        </div>
        <ChevronRight size={16} className="text-slate-300" />
      </button>
      <button className="w-full flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-3">
          <Settings className="text-slate-400" size={18} />
          <span className="text-xs font-bold text-slate-600">Medical Privacy Settings</span>
        </div>
        <ChevronRight size={16} className="text-slate-300" />
      </button>
    </div>
  </div>
);

const LabModal = ({ onComplete, onCancel }: { onComplete: (answers: string[]) => void, onCancel: () => void }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const questions = [
    { 
      id: "metabolic", 
      question: "Did you experience a severe mid-afternoon crash (2 PM - 4 PM) this week?", 
      options: ["Yes, multiple days", "Once or twice", "No, sustained energy"] 
    },
    { 
      id: "testosterone", 
      question: "How consistent was your morning baseline (erectile quality)?", 
      options: ["Absent/Weak", "Inconsistent", "Optimal"] 
    },
    { 
      id: "sleep", 
      question: "Did you wake up unprompted before your alarm feeling unrested?", 
      options: ["Frequently", "Occasionally", "Slept through"] 
    },
    { 
      id: "cns", 
      question: "How was your physical grip strength and workout recovery?", 
      options: ["Noticeably weaker", "Standard", "Peaking"] 
    }
  ];

  const handleSelect = (option: string) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 220 }}
      className="absolute inset-0 bg-slate-50 z-[100] flex flex-col"
    >
      <BackgroundGlows />
      <header className="p-7 flex justify-between items-center relative z-10">
        <button onClick={onCancel} className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Abort</button>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div key={questions[i].id} className={cn("h-1 w-8 rounded-full transition-all duration-500", i <= step ? "bg-teal-600 shadow-[0_0_8px_rgba(13,148,136,0.2)]" : "bg-slate-200")} />
          ))}
        </div>
        <div className="w-12" />
      </header>

      <div className="flex-1 px-10 pt-20 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-16"
          >
            <div className="space-y-4">
              <span className="text-teal-600 font-black uppercase tracking-[0.4em] text-[10px]">Diagnostic Pulse • {step + 1} of 4</span>
              <h2 className="text-4xl font-black tracking-tighter text-slate-800 leading-[1.1]">
                {questions[step].question}
              </h2>
            </div>

            <div className="space-y-3.5">
              {questions[step].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className="w-full bg-white border border-slate-100 p-7 rounded-[2rem] text-left font-black text-slate-700 hover:border-teal-600 hover:text-teal-600 transition-all flex justify-between items-center group shadow-sm active:bg-teal-600 active:text-white"
                >
                  <span className="text-lg tracking-tight">{opt}</span>
                  <ChevronRight size={22} className="text-slate-200 group-hover:text-teal-600 group-active:text-white" />
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-12 text-center relative z-10">
        <p className="text-[10px] text-slate-300 uppercase tracking-[0.3em] font-black italic">Proactive Clinical Intelligence</p>
      </div>
    </motion.div>
  );
};

const ProcessingTheater = ({ onFinished }: { onFinished: () => void }) => {
  const steps = [
    "Compiling biometric telemetry...",
    "Scanning SHI cohort benchmarks...",
    "Calibrating restoration index...",
    "Finalizing clinical protocol..."
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => {
        if (i < steps.length - 1) return i + 1;
        clearInterval(timer);
        setTimeout(onFinished, 500);
        return i;
      });
    }, 900);
    return () => clearInterval(timer);
  }, [onFinished, steps.length]);

  return (
    <div className="absolute inset-0 bg-white z-[110] flex flex-col items-center justify-center p-14 text-center space-y-10">
      <BackgroundGlows />
      <div className="relative z-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-2 border-slate-50 border-t-teal-600 shadow-xl"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Microscope className="text-teal-600/40 w-10 h-10" />
        </div>
      </div>
      <div className="h-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-slate-500 font-bold tracking-tight text-sm uppercase tracking-widest"
          >
            {steps[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Main Page ---

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLabOpen, setIsLabOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [state, setState] = useState<UserState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("rxmen_user_state_v2");
    setTimeout(() => {
      if (savedState) {
        setState(JSON.parse(savedState));
      }
      setIsLoaded(true);
    }, 0);
  }, []);

  const handleLabComplete = (answers: string[]) => {
    setIsLabOpen(false);
    setIsProcessing(true);
    
    // 1. Scoring Logic
    const q1 = OPTION_VALUES[answers[0]];
    const q2 = OPTION_VALUES[answers[1]];
    const q3 = OPTION_VALUES[answers[2]];
    const q4 = OPTION_VALUES[answers[3]];

    const metabolicScore = (q1 + q3) / 2;
    const testosteroneScore = (q2 + q4) / 2;
    const cnsScore = (q3 + q4) / 2;
    const overallRPI = Math.round((metabolicScore + testosteroneScore + cnsScore) / 3);

    // 2. Insight Generation
    let insightText = "All systems optimized. You are in the top 10% of your cohort. Maintain your current protocol.";
    let recommendedProductId = "optimized";

    const scoresArray = [
      { id: 'metabolic', score: metabolicScore },
      { id: 'testosterone', score: testosteroneScore },
      { id: 'cns', score: cnsScore }
    ];

    const lowest = [...scoresArray].sort((a, b) => a.score - b.score)[0];

    if (lowest.score <= 85) {
      if (lowest.id === 'metabolic') {
        insightText = "Your mid-day crashes and fragmented sleep suggest cortisol dysregulation. This systemic stress will block testosterone recovery. We are temporarily up-dosing your KSM-66 Ashwagandha protocol.";
        recommendedProductId = "ashwagandha";
      } else if (lowest.id === 'testosterone') {
        insightText = "Your morning baseline metrics indicate your free testosterone is not fully recovering overnight. We need to adjust your protocol to protect your deep sleep cycles.";
        recommendedProductId = "sleep";
      } else {
        insightText = "Weakened grip strength and poor sleep are classic signs of Central Nervous System (CNS) fatigue. You are overtraining. Swap tomorrow's workout for active recovery.";
        recommendedProductId = "optimized";
      }
    }

    const newState: UserState = {
      overallRPI,
      subScores: { metabolic: metabolicScore, testosterone: testosteroneScore, cns: cnsScore },
      insightText,
      recommendedProductId
    };
    
    setTimeout(() => {
      setState(newState);
      localStorage.setItem("rxmen_user_state_v2", JSON.stringify(newState));
    }, 1800);
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="bg-slate-200 min-h-screen flex items-center justify-center font-sans antialiased p-4">
      <div className="w-full max-w-md h-[844px] bg-slate-50 relative overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,0.3)] rounded-[4.5rem] border-[14px] border-slate-950">
        
        <BackgroundGlows />

        <div className="h-10 w-full px-12 flex justify-between items-center text-slate-800 text-[10px] font-black pt-4 z-30 relative">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-pulse" />
            <span className="uppercase tracking-widest">Diagnostic Live</span>
          </div>
          <span>9:41</span>
        </div>

        <div className="h-full w-full relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">
                <DashboardView state={state} onStartLab={() => setIsLabOpen(true)} />
              </motion.div>
            )}
            {activeTab === 'benchmark' && (
              <motion.div key="benchmark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">
                <BenchmarkView state={state} />
              </motion.div>
            )}
            {activeTab === 'protocol' && (
              <motion.div key="protocol" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">
                <ProtocolView state={state} />
              </motion.div>
            )}
            {activeTab === 'care' && (
              <motion.div key="care" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">
                <CareTeamView state={state} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isLabOpen && (
            <LabModal key="lab" onComplete={handleLabComplete} onCancel={() => setIsLabOpen(false)} />
          )}
          {isProcessing && (
            <ProcessingTheater key="processing" onFinished={() => setIsProcessing(false)} />
          )}
        </AnimatePresence>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="absolute bottom-2 w-32 h-1 bg-slate-900/10 rounded-full left-1/2 -translate-x-1/2 z-30" />
      </div>
    </div>
  );
}
