import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { AcademicBanner } from './components/AcademicBanner';
import { UnifiedRiskScore } from './components/UnifiedRiskScore';
import { MultiVectorAttackTree } from './components/MultiVectorAttackTree';
import { TieredExecutionWidget } from './components/TieredExecutionWidget';
import { AlertTriageFeed } from './components/AlertTriageFeed';
import { MalwareAnalysisView } from './components/MalwareAnalysisView';
import { PhishingUrlView } from './components/PhishingUrlView';
import { EmailFilterView } from './components/EmailFilterView';
import { NetworkNidsView } from './components/NetworkNidsView';
import { XaiHubView } from './components/XaiHubView';
import { SocChatbot } from './components/SocChatbot';
import { IncidentPlaybooksView } from './components/IncidentPlaybooksView';
import { ResearchDocsView } from './components/ResearchDocsView';
import { 
  SAMPLE_MULTI_VECTOR_CAMPAIGN, 
  INITIAL_ALERTS, 
  SAMPLE_MALWARE_DATA, 
  SAMPLE_PHISHING_URLS, 
  SAMPLE_EMAILS, 
  SAMPLE_NETWORK_PCAP 
} from './data/sampleScans';
import { AlertItem } from './types/cybersecurity';
import { 
  Activity, 
  Bot, 
  Download, 
  Flame, 
  Radio, 
  ShieldAlert, 
  Terminal, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [chatbotPrompt, setChatbotPrompt] = useState<string>('');
  const [selectedMalwareSample, setSelectedMalwareSample] = useState<string>('invoice_payment_2026.exe');
  const [selectedUrlSample, setSelectedUrlSample] = useState<string>('http://secure-login-microsoft365.account-verify.online/auth/login.php?session=9283');
  const [selectedEmailSample, setSelectedEmailSample] = useState<string>('urgent_payroll_wire.eml');
  const [selectedPcapSample, setSelectedPcapSample] = useState<string>('pcap_ddos_syn_flood.pcap');
  const [activePlaybookId, setActivePlaybookId] = useState<string>('PLAYBOOK-APT-CRITICAL-CONTAINMENT');

  // Unified Risk Index & Vector Scores
  const vectorScores = {
    malware: SAMPLE_MALWARE_DATA[selectedMalwareSample]?.overallRiskScore || 94,
    url: SAMPLE_PHISHING_URLS[selectedUrlSample]?.riskScore || 92,
    email: SAMPLE_EMAILS[selectedEmailSample]?.riskScore || 89,
    network: SAMPLE_NETWORK_PCAP[selectedPcapSample]?.riskScore || 96
  };

  // Normalization formula from Synopsis Sec 3.2 & 4.1
  const overallRiskIndex = Math.round(
    vectorScores.malware * 0.30 +
    vectorScores.url * 0.20 +
    vectorScores.email * 0.20 +
    vectorScores.network * 0.30
  );

  const handleAskChatbot = (promptText: string) => {
    setChatbotPrompt(promptText);
    setActiveTab('chatbot');
  };

  const handleSelectVector = (vectorName: string, artifact: string) => {
    if (vectorName === 'malware') {
      setSelectedMalwareSample('invoice_payment_2026.exe');
      setActiveTab('malware');
    } else if (vectorName === 'url') {
      setSelectedUrlSample('http://secure-login-microsoft365.account-verify.online/auth/login.php?session=9283');
      setActiveTab('phishing');
    } else if (vectorName === 'email') {
      setSelectedEmailSample('urgent_payroll_wire.eml');
      setActiveTab('email');
    } else if (vectorName === 'network') {
      setSelectedPcapSample('pcap_ddos_syn_flood.pcap');
      setActiveTab('network');
    }
  };

  const handleInvestigateAlert = (alert: AlertItem) => {
    if (alert.vector === 'Multi-Vector') {
      setActiveTab('dashboard');
    } else if (alert.vector === 'Malware') {
      setActiveTab('malware');
    } else if (alert.vector === 'URL') {
      setActiveTab('phishing');
    } else if (alert.vector === 'Email') {
      setActiveTab('email');
    } else if (alert.vector === 'Network') {
      setActiveTab('network');
    }
  };

  const handleUpdateAlertStatus = (alertId: string, newStatus: AlertItem['status']) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
  };

  const handleExecutePlaybook = (playbookId: string) => {
    setActivePlaybookId(playbookId);
    setActiveTab('playbooks');
  };

  const handleExportIncidentReport = () => {
    const reportText = `# AI CYBERSECURITY ASSISTANT - EXECUTIVE INCIDENT REPORT
Project: AI Cybersecurity Assistance (Team CSE27-386)
Institution: Graphic Era Hill University, Dehradun
Date: ${new Date().toISOString()}

===================================================================
1. INCIDENT EXECUTIVE SUMMARY
===================================================================
Incident ID: ${SAMPLE_MULTI_VECTOR_CAMPAIGN.id}
Campaign Name: ${SAMPLE_MULTI_VECTOR_CAMPAIGN.campaignName}
Unified Threat Risk Score: ${overallRiskIndex} / 100 [CRITICAL RISK]
Status: ${SAMPLE_MULTI_VECTOR_CAMPAIGN.status}

Narrative:
${SAMPLE_MULTI_VECTOR_CAMPAIGN.narrative}

===================================================================
2. CORRELATED MULTI-VECTOR TELEMETRY
===================================================================
- Vector 1 (Email): ${SAMPLE_EMAILS['urgent_payroll_wire.eml'].subject} [Score: ${vectorScores.email}/100, SPF: FAIL, DMARC: FAIL]
- Vector 2 (URL): ${SAMPLE_PHISHING_URLS['http://secure-login-microsoft365.account-verify.online/auth/login.php?session=9283'].url} [Score: ${vectorScores.url}/100, Brand: Microsoft 365]
- Vector 3 (Malware): ${SAMPLE_MALWARE_DATA['invoice_payment_2026.exe'].fileName} [Score: ${vectorScores.malware}/100, SHA256: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08]
- Vector 4 (Network): ${SAMPLE_NETWORK_PCAP['pcap_ddos_syn_flood.pcap'].captureSource} [Score: ${vectorScores.network}/100, Reconstruction Loss: 0.942 vs 0.250]

===================================================================
3. EXPLAINABLE AI (SHAP) ATTRIBUTION
===================================================================
- Top Contributing Features:
  1. Autoencoder Reconstruction Loss (>0.250) -> +0.45 SHAP
  2. High Section Entropy in .upx0 Section (7.94) -> +0.38 SHAP
  3. Dynamic Process Hollowing (VirtualAllocEx + RemoteThread) -> +0.34 SHAP
  4. Deceptive Urgency Cues & Sender SPF Mismatch -> +0.42 SHAP

===================================================================
4. RECOMMENDED CONTAINMENT PROCEDURES
===================================================================
1. Isolate Workstation-A (192.168.1.104) via PowerShell interface disable.
2. Block perimeter egress to C2 IP 185.220.101.5 on ports 80, 443, 8443.
3. Terminate process handles for invoice_payment_2026.exe (PID 1044).
4. Quarantine hash 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08 in AppLocker.
`;

    const blob = new Blob([reportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `INCIDENT-REPORT-${SAMPLE_MULTI_VECTOR_CAMPAIGN.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* Top Academic Banner */}
      <AcademicBanner />

      {/* Main Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Row 1: Unified Threat Index + Tiered Controller */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <UnifiedRiskScore 
                  score={overallRiskIndex}
                  vectorScores={vectorScores}
                />
              </div>
              <div className="lg:col-span-5">
                <TieredExecutionWidget />
              </div>
            </div>

            {/* Row 2: Multi-Vector Cross-Correlation Attack Tree */}
            <div>
              <MultiVectorAttackTree
                campaign={SAMPLE_MULTI_VECTOR_CAMPAIGN}
                onSelectVector={handleSelectVector}
                onAskChatbot={handleAskChatbot}
              />
            </div>

            {/* Row 3: Live Alerts Feed */}
            <div>
              <AlertTriageFeed
                alerts={alerts}
                onInvestigateAlert={handleInvestigateAlert}
                onUpdateAlertStatus={handleUpdateAlertStatus}
              />
            </div>

            {/* Quick Action Bar for Incident Response */}
            <div className="p-4 bg-gradient-to-r from-cyber-900 via-cyber-850 to-cyber-900 border border-cyan-500/30 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-950 text-red-400 border border-red-500/40">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Critical Incident Active: {SAMPLE_MULTI_VECTOR_CAMPAIGN.id}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Multi-vector correlation detected cross-layer compromise on host 192.168.1.104
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExecutePlaybook('PLAYBOOK-APT-CRITICAL-CONTAINMENT')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-500/40 text-xs font-mono font-bold transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Launch Containment Playbook</span>
                </button>

                <button
                  onClick={handleExportIncidentReport}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-700 text-cyan-300 border border-cyber-border text-xs font-mono transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Vector 1: Malware Analysis */}
        {activeTab === 'malware' && (
          <MalwareAnalysisView
            onAskChatbot={handleAskChatbot}
            initialSample={selectedMalwareSample}
          />
        )}

        {/* Vector 2: Phishing & URL */}
        {activeTab === 'phishing' && (
          <PhishingUrlView
            onAskChatbot={handleAskChatbot}
            initialUrlKey={selectedUrlSample}
          />
        )}

        {/* Vector 3: Malicious Email */}
        {activeTab === 'email' && (
          <EmailFilterView
            onAskChatbot={handleAskChatbot}
            initialEmailKey={selectedEmailSample}
          />
        )}

        {/* Vector 4: Network NIDS */}
        {activeTab === 'network' && (
          <NetworkNidsView
            onAskChatbot={handleAskChatbot}
            initialPcapKey={selectedPcapSample}
          />
        )}

        {/* Explainable AI Hub (SHAP) */}
        {activeTab === 'xai' && (
          <XaiHubView />
        )}

        {/* AI SOC Chatbot Copilot */}
        {activeTab === 'chatbot' && (
          <SocChatbot
            initialPrompt={chatbotPrompt}
            onExecutePlaybook={handleExecutePlaybook}
            onExportReport={handleExportIncidentReport}
          />
        )}

        {/* Playbooks & Incident Response */}
        {activeTab === 'playbooks' && (
          <IncidentPlaybooksView
            initialPlaybookId={activePlaybookId}
          />
        )}

        {/* Research & Synopsis Documentation */}
        {activeTab === 'research' && (
          <ResearchDocsView />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-cyber-950 border-t border-cyber-border py-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            AI CYBERSECURITY ASSISTANCE • Project Team: <strong className="text-cyan-400">CSE27-386</strong>
          </div>
          <div>
            Graphic Era Hill University, Dehradun • Guided by Mr. Saksham Mittal
          </div>
          <div className="text-slate-600">
            CNN-LSTM • Dual-Path LightGBM/DistilBERT • AE-LSTM • SHAP XAI • Grounded RAG
          </div>
        </div>
      </footer>

    </div>
  );
};
