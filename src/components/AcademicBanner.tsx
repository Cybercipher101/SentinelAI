import React, { useState } from 'react';
import { PROJECT_METADATA } from '../data/researchData';
import { GraduationCap, Users, UserCheck, Award, ChevronDown, ChevronUp, Cpu, ShieldCheck } from 'lucide-react';

export const AcademicBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-cyber-900 via-cyber-850 to-cyber-900 border-b border-cyber-border text-xs px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Institution & Team ID */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md text-cyan-400 font-mono font-medium">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>{PROJECT_METADATA.institution}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Team: <strong className="text-cyan-300 font-bold">{PROJECT_METADATA.projectTeamId}</strong></span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <span className="text-slate-400">{PROJECT_METADATA.department}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{PROJECT_METADATA.location}</span>
          </div>
        </div>

        {/* Right Info & Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guide: <strong className="text-slate-100">{PROJECT_METADATA.guide.name}</strong> ({PROJECT_METADATA.guide.designation})</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded text-emerald-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>4 AI ENGINES LOADED</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 bg-cyber-800 hover:bg-cyber-700 text-slate-300 hover:text-white px-2 py-1 rounded border border-cyber-border-light transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Project Team</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expanded Academic Team Details */}
      {isExpanded && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-cyber-border/70 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn text-slate-300">
          <div className="bg-cyber-950/80 p-2.5 rounded border border-cyber-border">
            <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Student Researchers</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
              {PROJECT_METADATA.students.map((student, idx) => (
                <div key={idx} className="bg-slate-900/60 p-1 rounded border border-slate-800/80">
                  <span className="text-slate-200 font-medium">{student.name}</span>
                  <span className="block text-slate-400 text-[10px]">Roll: {student.rollNumber}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-cyber-950/80 p-2.5 rounded border border-cyber-border">
            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Project Supervision</span>
            </div>
            <p className="text-slate-200 font-medium">{PROJECT_METADATA.guide.name}</p>
            <p className="text-slate-400 text-[11px]">{PROJECT_METADATA.guide.designation}</p>
            <p className="text-slate-400 text-[11px]">{PROJECT_METADATA.institution}</p>
          </div>

          <div className="bg-cyber-950/80 p-2.5 rounded border border-cyber-border flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Synopsis Specifications</span>
              </div>
              <p className="text-slate-300 text-[11px]">Degree: B.Tech Computer Science & Engineering</p>
              <p className="text-slate-400 text-[10px] mt-0.5">Focus: Multi-Modal Deep Learning & Explainable AI (SHAP/RAG)</p>
            </div>
            <div className="text-[10px] text-cyan-400 font-mono mt-1">Date: {PROJECT_METADATA.date}</div>
          </div>
        </div>
      )}
    </div>
  );
};
