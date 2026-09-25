import React from 'react';
import { TIERED_EXECUTION_DATA } from '../data/researchData';
import { Cpu, Zap, Gauge, Server, CheckCircle, ArrowDown } from 'lucide-react';

export const TieredExecutionWidget: React.FC = () => {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-cyber-border/70 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Tiered Execution Controller</h3>
            <p className="text-[11px] text-slate-400 font-mono">Synopsis Sec 4.3 Cascading AI Triage</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>EFFICIENCY OPTIMIZED</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-cyber-900/80 p-3 rounded-lg border border-cyber-border">
          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mb-1">
            <Server className="w-3 h-3 text-cyan-400" />
            <span>TOTAL SCANS</span>
          </div>
          <div className="text-xl font-mono font-bold text-slate-100">
            {TIERED_EXECUTION_DATA.totalScansProcessed.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Across 4 AI engines</div>
        </div>

        <div className="bg-cyber-900/80 p-3 rounded-lg border border-cyber-border">
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mb-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>FAST TRIAGE (TIER 1)</span>
          </div>
          <div className="text-xl font-mono font-bold text-emerald-400">
            85.0%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{TIERED_EXECUTION_DATA.lightweightTriagePassed.toLocaleString()} items filtered &lt;10ms</div>
        </div>

        <div className="bg-cyber-900/80 p-3 rounded-lg border border-cyber-border">
          <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 mb-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>COMPUTE SAVED</span>
          </div>
          <div className="text-xl font-mono font-bold text-cyan-400">
            {TIERED_EXECUTION_DATA.computePowerSavedPercent}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">GPU/CPU overhead reduction</div>
        </div>

        <div className="bg-cyber-900/80 p-3 rounded-lg border border-cyber-border">
          <div className="text-[10px] font-mono text-amber-400 flex items-center gap-1 mb-1">
            <Gauge className="w-3 h-3 text-amber-400" />
            <span>AVG LATENCY</span>
          </div>
          <div className="text-xl font-mono font-bold text-amber-300">
            {TIERED_EXECUTION_DATA.avgResponseTimeMs} ms
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">GPU Load: {TIERED_EXECUTION_DATA.gpuUtilization}</div>
        </div>
      </div>

      {/* Visual Cascading Architecture Diagram */}
      <div className="bg-cyber-950/90 border border-cyber-border rounded-lg p-3.5">
        <div className="text-[11px] font-mono text-cyan-400 font-semibold mb-2 flex items-center justify-between">
          <span>TIERED PIPELINE EXECUTION FLOW</span>
          <span className="text-slate-500 text-[10px]">Zero Unnecessary Sandbox Executions</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 text-xs font-mono">
          <div className="flex-1 w-full bg-cyber-900 border border-slate-700 p-2.5 rounded text-center">
            <span className="text-cyan-400 font-bold block">1. Ingestion Gateway</span>
            <span className="text-[10px] text-slate-400">Fast Sanitization & Preprocessing</span>
          </div>

          <div className="text-cyan-400 font-bold sm:rotate-0 rotate-90">→</div>

          <div className="flex-1 w-full bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded text-center">
            <span className="text-emerald-400 font-bold block">2. Tier 1: Lightweight Filter</span>
            <span className="text-[10px] text-slate-300">Lexical / TF-IDF / Heuristics (~4ms)</span>
          </div>

          <div className="text-amber-400 font-bold sm:rotate-0 rotate-90">
            <span className="text-[10px] block text-amber-400">IoC Found?</span>
            →
          </div>

          <div className="flex-1 w-full bg-red-950/30 border border-red-500/40 p-2.5 rounded text-center">
            <span className="text-red-400 font-bold block">3. Tier 2: Deep DL Sandbox</span>
            <span className="text-[10px] text-slate-300">CNN-LSTM + Autoencoder (~200ms)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
