import React, { useState } from 'react';
import { PROJECT_METADATA, RESEARCH_REFERENCES } from '../data/researchData';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  FileText, 
  Award, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Search, 
  ExternalLink,
  GitBranch,
  ShieldCheck,
  Server
} from 'lucide-react';

export const ResearchDocsView: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [searchRef, setSearchRef] = useState<string>('');

  const chapters = [
    { title: 'Project Synopsis & Academic Details', id: 'meta' },
    { title: 'Abstract & Executive Summary', id: 'abstract' },
    { title: 'Chapter 1: Introduction & Significance', id: 'ch1' },
    { title: 'Chapter 2: Literature Review & Gap Analysis', id: 'ch2' },
    { title: 'Chapter 3: Problem Statement & Objectives', id: 'ch3' },
    { title: 'Chapter 4: Proposed Methodology & Figure 4.1 Flow', id: 'ch4' },
    { title: 'Chapter 5: Hardware & Software Requirements', id: 'ch5' },
    { title: 'Chapter 6: Expected Outcomes', id: 'ch6' },
    { title: 'Chapter 7: Conclusion & References [1-15]', id: 'ch7' }
  ];

  const filteredRefs = RESEARCH_REFERENCES.filter(r => {
    if (!searchRef.trim()) return true;
    const q = searchRef.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.authors.toLowerCase().includes(q) ||
      r.relevanceToProject.toLowerCase().includes(q) ||
      r.publication.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Project Synopsis & Research Documentation</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30 rounded">
                  Team ID: {PROJECT_METADATA.projectTeamId}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {PROJECT_METADATA.institution} • {PROJECT_METADATA.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Guide: <strong>{PROJECT_METADATA.guide.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Chapters Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table of Contents Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 shadow-lg sticky top-20">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-cyber-border">
              Table of Contents
            </h3>
            <div className="space-y-1">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapter(idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                    activeChapter === idx
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-900 border border-transparent'
                  }`}
                >
                  <span className="truncate">{ch.title}</span>
                  <span className="text-[10px] font-mono text-slate-500 ml-2">p.{idx + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-8">
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 shadow-lg min-h-[600px] text-slate-200">
            
            {/* Section 0: Project Academic Metadata */}
            {activeChapter === 0 && (
              <div className="space-y-6">
                <div className="text-center pb-6 border-b border-cyber-border">
                  <div className="inline-block px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold mb-3">
                    A SYNOPSIS ON
                  </div>
                  <h1 className="text-2xl font-black text-slate-100 tracking-tight mb-2">
                    {PROJECT_METADATA.title}
                  </h1>
                  <p className="text-sm text-cyan-400 font-mono mb-4">{PROJECT_METADATA.subTitle}</p>
                  <p className="text-xs text-slate-400">
                    Submitted in partial fulfillment of the requirement for the award of the degree of
                  </p>
                  <p className="text-xs font-bold text-slate-200 uppercase tracking-widest mt-1">
                    Bachelor of Technology in Computer Science & Engineering
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-mono">
                    {PROJECT_METADATA.institution}, {PROJECT_METADATA.location} • {PROJECT_METADATA.date}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Students list */}
                  <div className="bg-cyber-900 p-4 rounded-xl border border-cyber-border">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono mb-3 flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>Submitted By (Student Researchers):</span>
                    </h4>
                    <div className="space-y-2 font-mono text-xs">
                      {PROJECT_METADATA.students.map((st, i) => (
                        <div key={i} className="flex justify-between items-center py-1.5 border-b border-cyber-border/40">
                          <span className="text-slate-100 font-semibold">{st.name}</span>
                          <span className="text-slate-400 bg-cyber-950 px-2 py-0.5 rounded border border-slate-800">
                            Roll: {st.rollNumber}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Supervision */}
                  <div className="bg-cyber-900 p-4 rounded-xl border border-cyber-border flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono mb-3 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4" />
                        <span>Under the Guidance of:</span>
                      </h4>
                      <p className="text-base font-bold text-slate-100">{PROJECT_METADATA.guide.name}</p>
                      <p className="text-xs text-slate-400">{PROJECT_METADATA.guide.designation}</p>
                      <p className="text-xs text-slate-400">{PROJECT_METADATA.guide.department}</p>
                      <p className="text-xs text-slate-400">{PROJECT_METADATA.institution}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-cyber-border flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">Project Team ID:</span>
                      <span className="text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                        {PROJECT_METADATA.projectTeamId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 1: Abstract */}
            {activeChapter === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-100 pb-2 border-b border-cyber-border">
                  Abstract
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed text-justify">
                  The rapid escalation and evolving sophistication of cyber threats necessitate an urgent transition from traditional, static signature-based detection models to intelligent, highly adaptive defensive systems. In the contemporary digital ecosystem, cybersecurity operations are severely fragmented. Organizations typically rely on siloed, independent tools for distinct tasks such as malware analysis, phishing detection, anomalous network behavior monitoring, and email filtering. This disjointed architecture not only generates an overwhelming volume of disconnected alerts—leading to critical "alert fatigue" among Security Operations Center (SOC) analysts—but also demands highly specialized expertise to parse, interpret, and remediate the underlying threats.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed text-justify">
                  This project proposes the comprehensive design and development of an <strong>Integrated AI Cyber Security Assistant</strong>. This system serves as a unified, multi-modal platform that consolidates four critical detection engines: <em>Malware Analysis</em>, <em>Phishing URL Classification</em>, <em>Malicious Email Filtering</em>, and <em>Network Anomaly Detection (NIDS)</em>. By leveraging advanced Deep Learning architectures—specifically Convolutional Neural Networks (CNN) for spatial and structural feature extraction from binaries and URLs, and Long Short-Term Memory (LSTM) networks alongside Autoencoders for temporal sequence modeling of API calls and network traffic flows—the system achieves high-fidelity, cross-vector threat identification.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed text-justify">
                  A primary and novel innovation of this research is the integration of a <strong>Conversational AI overlay</strong>, powered by Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG), tightly coupled with Explainable AI (XAI) frameworks such as SHAP (SHapley Additive exPlanations). This interface acts as an intelligent intermediary, directly translating complex mathematical risk scores, network telemetry, and abstract deep learning outputs into contextualized, plain-language summaries and actionable remediation playbooks.
                </p>
              </div>
            )}

            {/* Section 2: Chapter 1 */}
            {activeChapter === 2 && (
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <h3 className="text-lg font-bold text-slate-100 pb-2 border-b border-cyber-border">
                  Chapter 1: Introduction & Significance
                </h3>
                <h4 className="text-sm font-bold text-cyan-400 pt-2">1.1 Background</h4>
                <p>
                  The contemporary digital landscape is characterized by an unprecedented volume and complexity of cyber-attacks. Threat actors have evolved from launching simple, easily identifiable attacks to orchestrating sophisticated, multi-stage campaigns that include zero-day malware, highly targeted spear-phishing, ransomware-as-a-service (RaaS), and advanced persistent threats (APTs). Conventional signature-based security paradigms are increasingly failing against polymorphic and metamorphic malware that dynamically alters its underlying code structure during execution.
                </p>

                <h4 className="text-sm font-bold text-cyan-400 pt-2">1.2 Need for the System</h4>
                <p>
                  Despite the integration of AI into cybersecurity, a significant gap remains in the operationalization and usability of these advanced tools. Disjointed "point products" generate vast amounts of disparate logs without correlation, directly causing <em>alert fatigue</em>. Furthermore, deep neural networks act as opaque "black boxes," issuing high-severity alerts without providing logical justifications.
                </p>

                <h4 className="text-sm font-bold text-cyan-400 pt-2">1.3 Significance and Scope</h4>
                <p>
                  This project introduces a unified, multi-modal approach that correlates signals across all four attack vectors—Email, URL, File Executables, and Network Traffic. Crucially, the conversational interface democratizes cybersecurity, empowering administrators of all skill levels to triage threats and execute automated remediation.
                </p>
              </div>
            )}

            {/* Section 3: Chapter 2 Literature Review */}
            {activeChapter === 3 && (
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <h3 className="text-lg font-bold text-slate-100 pb-2 border-b border-cyber-border">
                  Chapter 2: Literature Review
                </h3>

                <div className="space-y-3">
                  <div className="bg-cyber-900 p-3 rounded-lg border border-cyber-border">
                    <h4 className="font-bold text-cyan-300 mb-1">2.1 Malware Detection via Deep Learning</h4>
                    <p className="text-slate-400 text-[11px]">
                      Static analysis converts PE binaries to 2D grayscale images for CNN spatial texture classification [2]. Dynamic analysis utilizes hybrid CNN-LSTM networks to capture sequential Win32 API calls [3].
                    </p>
                  </div>

                  <div className="bg-cyber-900 p-3 rounded-lg border border-cyber-border">
                    <h4 className="font-bold text-cyan-300 mb-1">2.2 Phishing & URL Analysis</h4>
                    <p className="text-slate-400 text-[11px]">
                      Dual-path frameworks combine structural lexical feature extraction (LightGBM on 30+ features) with Transformer semantic NLP models (DistilBERT) evaluated on the PhiUSIIL dataset [6, 7].
                    </p>
                  </div>

                  <div className="bg-cyber-900 p-3 rounded-lg border border-cyber-border">
                    <h4 className="font-bold text-cyan-300 mb-1">2.3 Network Intrusion Detection Systems (NIDS)</h4>
                    <p className="text-slate-400 text-[11px]">
                      Unsupervised Autoencoders learn benign baseline distributions, triggering anomaly alerts when reconstruction error spikes. Combined with LSTM spatiotemporal tracking on CICIDS2017 [11, 12].
                    </p>
                  </div>

                  <div className="bg-cyber-900 p-3 rounded-lg border border-cyber-border">
                    <h4 className="font-bold text-cyan-300 mb-1">2.4 Research Gaps & Justification for Integration</h4>
                    <p className="text-slate-400 text-[11px]">
                      Prior works target single threat vectors in isolation and fail to address the "accuracy-explainability trilemma" [13, 14]. Our conversational RAG layer resolves this fundamental gap.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Chapter 3 Problem Statement & Objectives */}
            {activeChapter === 4 && (
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <h3 className="text-lg font-bold text-slate-100 pb-2 border-b border-cyber-border">
                  Chapter 3: Problem Statement & Objectives
                </h3>

                <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl mb-4">
                  <h4 className="font-bold text-red-400 mb-2 font-mono">3.1 Problem Statement</h4>
                  <ul className="space-y-2 list-disc list-inside text-slate-300">
                    <li><strong>Operational Fragmentation:</strong> Security tools operate in strict isolation, forcing manual correlation of multi-stage attacks.</li>
                    <li><strong>Cognitive Overload:</strong> Raw JSON logs, memory dumps, and packet headers overwhelm standard administrators.</li>
                    <li><strong>The "Black Box" Dilemma:</strong> Opaque deep learning models issue alerts without transparent reasoning.</li>
                  </ul>
                </div>

                <div className="bg-cyan-950/20 border border-cyan-500/30 p-4 rounded-xl">
                  <h4 className="font-bold text-cyan-400 mb-2 font-mono">3.2 Core Objectives</h4>
                  <ul className="space-y-2 list-disc list-inside text-slate-300">
                    <li>Develop a 4-module Deep Learning detection engine (Malware, URL, Email, NIDS).</li>
                    <li>Implement a Central Controller for 0-100 unified threat index normalization.</li>
                    <li>Integrate SHAP/LIME Explainable AI frameworks for feature-level justifications.</li>
                    <li>Deploy a context-aware conversational RAG interface for plain-language remediation.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Section 5: Chapter 4 Proposed Methodology & Figure 4.1 Flow */}
            {activeChapter === 5 && (
              <div className="space-y-5 text-xs text-slate-300 leading-relaxed">
                <h3 className="text-lg font-bold text-slate-100 pb-2 border-b border-cyber-border">
                  Chapter 4: Proposed Methodology & Figure 4.1 Process Flow
                </h3>

                {/* Figure 4.1 Interactive Visual Flowchart */}
                <div className="bg-cyber-950 p-5 rounded-xl border border-cyan-500/40 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-mono text-cyan-400 font-bold text-xs">
                      Figure 4.1: End-to-End System Process Flow Architecture
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-500/40">
                      Synopsis Reference Diagram
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="bg-slate-900/90 border border-slate-700 p-2.5 rounded text-center">
                      <strong className="text-slate-100">1. User Submits Input via Dashboard</strong>
                      <span className="text-[11px] text-slate-400 block">File (.exe/.dll) • URL (link) • Email (.eml) • PCAP (traffic capture) • Chat Query</span>
                    </div>

                    <div className="text-cyan-400 text-center font-bold">↓</div>

                    <div className="bg-slate-900/90 border border-cyan-500/30 p-2.5 rounded text-center">
                      <strong className="text-cyan-300">2. FastAPI Gateway Receives & Validates Request</strong>
                      <span className="text-[11px] text-slate-400 block">Authenticates request, checks payload sizes, routes to matching scan endpoint</span>
                    </div>

                    <div className="text-cyan-400 text-center font-bold">↓</div>

                    {/* 4 parallel modules */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="bg-red-950/40 border border-red-500/40 p-2 rounded text-center">
                        <strong className="text-red-400 block text-[11px]">3a. File Scan</strong>
                        <span className="text-[10px] text-slate-400">PE Byte-to-Image CNN + API LSTM</span>
                      </div>
                      <div className="bg-amber-950/40 border border-amber-500/40 p-2 rounded text-center">
                        <strong className="text-amber-400 block text-[11px]">3b. URL Scan</strong>
                        <span className="text-[10px] text-slate-400">Dual-Path: LightGBM + DistilBERT</span>
                      </div>
                      <div className="bg-yellow-950/40 border border-yellow-500/40 p-2 rounded text-center">
                        <strong className="text-yellow-400 block text-[11px]">3c. Email Scan</strong>
                        <span className="text-[10px] text-slate-400">NLP TF-IDF + SPF/DMARC</span>
                      </div>
                      <div className="bg-purple-950/40 border border-purple-500/40 p-2 rounded text-center">
                        <strong className="text-purple-400 block text-[11px]">3d. Network Scan</strong>
                        <span className="text-[10px] text-slate-400">Autoencoder Loss + LSTM NIDS</span>
                      </div>
                    </div>

                    <div className="text-cyan-400 text-center font-bold">↓</div>

                    <div className="bg-orange-950/40 border border-orange-500/40 p-2.5 rounded text-center">
                      <strong className="text-orange-400">4. Risk Normalization Engine (Central Controller)</strong>
                      <span className="text-[11px] text-slate-300 block">0-30 Low • 31-60 Moderate • 61-80 Elevated • 81-100 Critical Threat Index</span>
                    </div>

                    <div className="text-cyan-400 text-center font-bold">↓</div>

                    <div className="bg-slate-900/90 border border-slate-700 p-2.5 rounded text-center">
                      <strong className="text-slate-100">5. Result Stored in Database & Multi-Vector Correlated</strong>
                      <span className="text-[11px] text-slate-400 block">Scan history, alerts, and model version audit logging</span>
                    </div>

                    <div className="text-cyan-400 text-center font-bold">↓</div>

                    <div className="bg-cyan-950/60 border border-cyan-500/50 p-2.5 rounded text-center">
                      <strong className="text-cyan-300">6. AI Conversational RAG Explains the Result & Generates Playbook</strong>
                      <span className="text-[11px] text-slate-300 block">Grounded in real scan data & SHAP features — zero hallucinated verdicts</span>
                    </div>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-cyan-400 pt-2">4.3 Efficiency & Tiered Execution Controller</h4>
                <p>
                  Institutes a cascading triage mechanism: lightweight modules act as the first line of defense (&lt;10ms). Deep Learning models are only dynamically triggered upon detecting high-probability indicators of compromise (IoC), saving 78.4% compute overhead.
                </p>
              </div>
            )}

            {/* Section 6: Chapter 5 Hardware and Software */}
            {activeChapter === 6 && (
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <h3 className="text-lg font-bold text-slate-100 pb-2 border-b border-cyber-border">
                  Chapter 5: Hardware and Software Requirements
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="bg-cyber-900 p-4 rounded-xl border border-cyber-border space-y-2">
                    <h4 className="font-bold text-cyan-400 uppercase mb-2">5.1 Hardware Requirements</h4>
                    <div>• <strong>CPU:</strong> Intel Core i7 (12th Gen+) / AMD Ryzen 7</div>
                    <div>• <strong>RAM:</strong> 16 GB Minimum (32 GB Recommended)</div>
                    <div>• <strong>GPU:</strong> NVIDIA RTX 3060 (6GB VRAM+) CUDA-capable</div>
                    <div>• <strong>Storage:</strong> 512 GB NVMe SSD</div>
                  </div>

                  <div className="bg-cyber-900 p-4 rounded-xl border border-cyber-border space-y-2">
                    <h4 className="font-bold text-emerald-400 uppercase mb-2">5.2 Software Requirements</h4>
                    <div>• <strong>OS:</strong> Windows 11 (WSL2) / Ubuntu 22.04 LTS</div>
                    <div>• <strong>Language:</strong> Python 3.9+ / TypeScript</div>
                    <div>• <strong>DL Frameworks:</strong> TensorFlow 2.x & Keras</div>
                    <div>• <strong>ML & NLP:</strong> Scikit-learn, LightGBM, HuggingFace Transformers</div>
                    <div>• <strong>XAI:</strong> SHAP (SHapley Additive exPlanations)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 7: Chapter 6 Expected Outcomes */}
            {activeChapter === 7 && (
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <h3 className="text-lg font-bold text-slate-100 pb-2 border-b border-cyber-border">
                  Chapter 6: Expected Outcomes
                </h3>

                <div className="space-y-3">
                  <div className="p-3 bg-cyber-900 rounded-lg border border-cyber-border flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-100 block mb-0.5">Fully Unified Software Prototype:</strong>
                      <span>Centralized dashboard ingesting varied threat vectors and correlating events in real time.</span>
                    </div>
                  </div>

                  <div className="p-3 bg-cyber-900 rounded-lg border border-cyber-border flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-100 block mb-0.5">High-Fidelity AI Models (&gt;97% Accuracy):</strong>
                      <span>Validated on EMBER (malware), PhiUSIIL (URLs), and CICIDS2017 (network traffic) benchmark datasets.</span>
                    </div>
                  </div>

                  <div className="p-3 bg-cyber-900 rounded-lg border border-cyber-border flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-100 block mb-0.5">Dynamic Explainability Dashboard (SHAP):</strong>
                      <span>Feature-importance graphs ensuring system decision-making is auditable and transparent.</span>
                    </div>
                  </div>

                  <div className="p-3 bg-cyber-900 rounded-lg border border-cyber-border flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-100 block mb-0.5">Actionable Conversational Chatbot:</strong>
                      <span>Virtual SOC assistant translating abstract risk scores into concrete incident response commands.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 8: Chapter 7 & References [1-15] */}
            {activeChapter === 8 && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-slate-100 pb-2 border-b border-cyber-border">
                  Chapter 7: Conclusion & References [1 - 15]
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed text-justify">
                  The proposed Integrated AI Cyber Security Assistant represents a crucial evolution toward intelligent, collaborative security interaction, where AI serves not merely as a background filter, but as an active, explainable partner in threat hunting and incident response.
                </p>

                {/* References Search & Table */}
                <div className="pt-3 border-t border-cyber-border">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase">
                      Literature Review Citation Matrix ({filteredRefs.length} References):
                    </h4>
                    <input
                      type="text"
                      placeholder="Filter citations..."
                      value={searchRef}
                      onChange={(e) => setSearchRef(e.target.value)}
                      className="bg-cyber-900 border border-cyber-border rounded px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredRefs.map((ref) => (
                      <div key={ref.citationNumber} className="bg-cyber-900/90 p-3.5 rounded-lg border border-cyber-border text-xs">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-bold text-slate-100">
                            [{ref.citationNumber}] {ref.authors} ({ref.year}). "{ref.title}"
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400 whitespace-nowrap bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                            {ref.publication}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2">
                          <strong className="text-slate-300">Relevance:</strong> {ref.relevanceToProject}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
                          <div className="bg-cyber-950 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block">PRIOR APPROACH:</span>
                            <span className="text-slate-300">{ref.comparedApproach}</span>
                          </div>
                          <div className="bg-emerald-950/40 p-2 rounded border border-emerald-500/30">
                            <span className="text-emerald-400 block font-bold">OUR PROPOSED ADVANTAGE:</span>
                            <span className="text-emerald-200">{ref.ourAdvantage}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
