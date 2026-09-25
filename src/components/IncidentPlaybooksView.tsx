import React, { useState } from 'react';
import { IncidentPlaybook } from '../types/cybersecurity';
import { INCIDENT_PLAYBOOKS } from '../data/sampleScans';
import { 
  Terminal, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Play, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Flame, 
  Zap, 
  Server 
} from 'lucide-react';

interface IncidentPlaybooksViewProps {
  initialPlaybookId?: string;
}

export const IncidentPlaybooksView: React.FC<IncidentPlaybooksViewProps> = ({
  initialPlaybookId = 'PLAYBOOK-APT-CRITICAL-CONTAINMENT'
}) => {
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>(initialPlaybookId);
  const [playbooks, setPlaybooks] = useState<IncidentPlaybook[]>(INCIDENT_PLAYBOOKS);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const currentPlaybook = playbooks.find(p => p.id === selectedPlaybookId) || playbooks[0];

  const handleToggleStep = (stepNumber: number) => {
    setPlaybooks(prev => prev.map(pb => {
      if (pb.id !== selectedPlaybookId) return pb;
      return {
        ...pb,
        steps: pb.steps.map(s => {
          if (s.stepNumber === stepNumber) {
            const nextStatus = s.status === 'completed' ? 'pending' : 'completed';
            return { ...s, status: nextStatus };
          }
          return s;
        })
      };
    }));
  };

  const handleExecuteAllSteps = () => {
    setPlaybooks(prev => prev.map(pb => {
      if (pb.id !== selectedPlaybookId) return pb;
      return {
        ...pb,
        steps: pb.steps.map(s => ({ ...s, status: 'completed' }))
      };
    }));
  };

  const handleCopyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Export IoCs in STIX 2.1 JSON Format
  const handleExportStix = () => {
    const stixBundle = {
      type: 'bundle',
      id: `bundle--${crypto.randomUUID()}`,
      spec_version: '2.1',
      objects: currentPlaybook.iocs.map((ioc, idx) => ({
        type: 'indicator',
        spec_version: '2.1',
        id: `indicator--${crypto.randomUUID()}`,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        name: `${ioc.type}: ${ioc.value}`,
        description: ioc.description,
        pattern_type: 'stix',
        pattern: `[${ioc.type.toLowerCase()}-addr:value = '${ioc.value}']`,
        valid_from: new Date().toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(stixBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `STIX-2.1-${currentPlaybook.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = 'Type,Value,Description\n';
    const rows = currentPlaybook.iocs.map(i => `"${i.type}","${i.value}","${i.description}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IOCs-${currentPlaybook.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedCount = currentPlaybook.steps.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / currentPlaybook.steps.length) * 100);

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-600/30 border border-red-500/40 text-red-400">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Automated Incident Response & Remediation Playbooks</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-red-950 text-red-400 border border-red-500/30 rounded">
                  Action Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Verified Multi-Vector Containment Scripts & STIX 2.1 Threat Intel Integration (Synopsis Sec 1.3 & 6)
              </p>
            </div>
          </div>

          {/* Playbook Switcher */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            {playbooks.map((pb) => (
              <button
                key={pb.id}
                onClick={() => setSelectedPlaybookId(pb.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedPlaybookId === pb.id
                    ? 'bg-red-500/20 text-red-300 border border-red-400 shadow-sm'
                    : 'bg-cyber-900 text-slate-400 hover:text-slate-200 border border-cyber-border'
                }`}
              >
                {pb.title.split(' ')[0]} {pb.title.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Playbook Steps & Execution Progress */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyber-border mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100">{currentPlaybook.title}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Threat: <span className="text-red-400 font-semibold">{currentPlaybook.threatType}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExecuteAllSteps}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-mono transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Execute All Steps</span>
                </button>
              </div>
            </div>

            {/* Progress Meter */}
            <div className="mb-5 p-3 bg-cyber-900/90 rounded-lg border border-cyber-border">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300 font-bold">Containment Execution Progress:</span>
                <span className="text-cyan-400 font-bold">{completedCount} of {currentPlaybook.steps.length} Steps Completed ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Step-by-Step Interactive Checklist */}
            <div className="space-y-4">
              {currentPlaybook.steps.map((step, idx) => {
                const isCompleted = step.status === 'completed';

                return (
                  <div
                    key={step.stepNumber}
                    className={`rounded-lg border p-4 transition-all ${
                      isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-cyber-900/80 border-cyber-border hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleStep(step.stepNumber)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all flex-shrink-0 mt-0.5 ${
                            isCompleted
                              ? 'bg-emerald-500 text-cyber-950'
                              : 'bg-cyber-800 text-slate-400 border border-slate-700 hover:border-cyan-400'
                          }`}
                        >
                          {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.stepNumber}
                        </button>
                        <div>
                          <h4 className={`text-xs font-bold ${isCompleted ? 'text-emerald-300' : 'text-slate-100'}`}>
                            {step.title}
                          </h4>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.description}</p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                        isCompleted
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                          : 'bg-amber-950 text-amber-400 border-amber-500/40'
                      }`}>
                        {step.status}
                      </span>
                    </div>

                    {/* Copyable Command Box */}
                    {step.command && (
                      <div className="mt-3 bg-cyber-950 rounded border border-slate-800 p-2.5 relative font-mono text-[11px]">
                        <div className="flex justify-between items-center text-[10px] text-slate-500 pb-1 mb-1 border-b border-slate-900">
                          <span>VERIFIED COMMAND LINE:</span>
                          <button
                            onClick={() => handleCopyCommand(step.command!, idx)}
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            {copiedCodeIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedCodeIdx === idx ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="text-slate-300 whitespace-pre-wrap overflow-x-auto selection:bg-cyan-500/30">
                          {step.command}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Indicators of Compromise (IoCs) & Export Tools */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-semibold text-slate-100">Extracted IoCs ({currentPlaybook.iocs.length})</h3>
              </div>
              <span className="text-[10px] font-mono text-red-400 font-bold">Threat Feeds</span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              High-fidelity Indicators of Compromise correlated across all active vectors for firewall and SIEM export:
            </p>

            {/* IoCs List */}
            <div className="space-y-2.5 mb-5">
              {currentPlaybook.iocs.map((ioc, idx) => (
                <div key={idx} className="bg-cyber-900 p-2.5 rounded-lg border border-cyber-border font-mono text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-1.5 py-0.2 rounded bg-red-950 text-red-400 text-[10px] font-bold border border-red-500/30">
                      {ioc.type}
                    </span>
                    <button
                      onClick={() => handleCopyCommand(ioc.value, 100 + idx)}
                      className="text-slate-400 hover:text-cyan-300 text-[10px] flex items-center gap-1"
                    >
                      {copiedCodeIdx === 100 + idx ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                    </button>
                  </div>
                  <div className="text-slate-200 font-bold break-all">{ioc.value}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{ioc.description}</div>
                </div>
              ))}
            </div>

            {/* Export Buttons */}
            <div className="space-y-2 pt-3 border-t border-cyber-border">
              <button
                onClick={handleExportStix}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export STIX 2.1 JSON Bundle</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-cyber-900 hover:bg-cyber-850 text-slate-300 border border-cyber-border text-xs font-mono transition-colors"
              >
                <FileCode className="w-3.5 h-3.5 text-slate-400" />
                <span>Export CSV Threat List</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
