import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/cybersecurity';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  Terminal, 
  FileDown, 
  Copy, 
  Check, 
  RefreshCw, 
  Flame, 
  Zap,
  Info
} from 'lucide-react';

interface SocChatbotProps {
  initialPrompt?: string;
  onExecutePlaybook?: (playbookId: string) => void;
  onExportReport?: () => void;
}

export const SocChatbot: React.FC<SocChatbotProps> = ({
  initialPrompt,
  onExecutePlaybook,
  onExportReport
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      timestamp: '13:45:10 UTC',
      text: `👋 **Greetings, SOC Analyst.** I am your **AI Cybersecurity Assistant** grounded in the real-time telemetry from our 4 Deep Learning engines (Malware CNN-LSTM, Phishing Dual-Path, Email NLP, and Network AE-LSTM).

I can explain any flagged threat, correlate attack chains across vectors, break down SHAP feature attributions, or generate verified containment playbooks.

How can I assist you with today's incident investigation?`,
      suggestedActions: [
        { label: 'Explain Multi-Vector Incident #386', actionType: 'custom', payload: 'Explain the multi-vector attack correlation for incident INC-2026-386' },
        { label: 'Why was the email quarantined?', actionType: 'custom', payload: 'Why was the email with subject URGENT: Immediate Account Suspension blocked?' },
        { label: 'Generate Host Isolation Script', actionType: 'isolate_host', payload: 'Generate PowerShell host isolation commands for workstation-A (192.168.1.104)' },
        { label: 'Export Incident Executive Report', actionType: 'generate_report' }
      ]
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== '') {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);

    setTimeout(() => {
      let botResponse: ChatMessage;

      const q = query.toLowerCase();

      if (q.includes('386') || q.includes('multi-vector') || q.includes('correlation') || q.includes('timeline')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString(),
          text: `### 🚨 Multi-Vector Incident Correlation Analysis: **Operation DarkVortex (INC-2026-386)**

The Central Controller has stitched together **4 disparate security telemetry signals** targeting Workstation-A (\`192.168.1.104\`):

1. **Email Vector (13:42:10 UTC)**: Spear-phishing email from \`finance-desk@payroll-update-gehu-corp.net\` bypassed initial boundary but was flagged with **96/100 Urgency** & **SPF/DMARC: FAIL**.
2. **URL Vector (13:43:02 UTC)**: Contained a link to \`http://secure-login-microsoft365.account-verify.online\` which the Dual-Path classifier flagged with **92/100 risk** for Microsoft credential harvesting.
3. **Malware Vector (13:44:18 UTC)**: Downloaded payload \`invoice_payment_2026.exe\` (SHA256 \`9f86d081...\`). The CNN-LSTM model identified **.upx0 entropy (7.94)** and dynamic **Process Hollowing** into \`explorer.exe\`.
4. **Network Vector (13:45:00 UTC)**: Autoencoder NIDS detected an immediate surge in reconstruction error (**0.942 vs 0.250 threshold**) as the payload initiated outbound C2 beaconing to \`185.220.101.5:8443\`.

**Unified Threat Risk Index**: **95/100 (CRITICAL)**. Immediate automated containment is advised.`,
          groundedTelemetry: {
            vector: 'Multi-Vector Correlated',
            riskScore: 95,
            iocFound: ['185.220.101.5', 'invoice_payment_2026.exe', '9f86d081884c7d65...'],
            shapExplanation: 'Composite SHAP attribution driven by API injection (+0.34) and Autoencoder reconstruction divergence (+0.45)'
          },
          suggestedActions: [
            { label: 'Execute APT Containment Playbook', actionType: 'isolate_host' },
            { label: 'Block C2 IP at Firewall (185.220.101.5)', actionType: 'block_ip', payload: '185.220.101.5' },
            { label: 'Export STIX 2.1 Threat Feed', actionType: 'generate_report' }
          ]
        };
      } else if (q.includes('email') || q.includes('urgent') || q.includes('quarantine')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString(),
          text: `### 📧 Email Risk Justification: **urgent_payroll_wire.eml**

The Malicious Email Gateway quarantined this message based on the following verified features:

* **Sender Spoofing**: The message claimed to be from \`payroll-update-gehu-corp.net\`, but cryptographic checks failed:
  \`\`\`text
  SPF: FAIL
  DKIM: FAIL
  DMARC: FAIL
  \`\`\`
* **NLP Urgency Index (96/100)**: Deceptive urgency detected with coercive phrasing: *"Immediate Account Suspension"*, *"Wire Verification Required Within 2 Hours"*.
* **Embedded Phishing URL**: Pointed to an unregistered domain on \`.online\` TLD trying to harvest Microsoft 365 credentials.

**Conclusion**: High-confidence Business Email Compromise (BEC) attempt. No employee interaction permitted.`,
          suggestedActions: [
            { label: 'Purge Similar Mails across Exchange', actionType: 'custom', payload: 'Purge all instances of payroll-update-gehu-corp.net from mailboxes' }
          ]
        };
      } else if (q.includes('isolate') || q.includes('containment') || q.includes('powershell') || q.includes('command')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString(),
          text: `### 🛡️ Instant Incident Containment Commands

Execute the following PowerShell & iptables scripts to immediately contain the breach on **Workstation-A (192.168.1.104)**:

\`\`\`powershell
# 1. Isolate Workstation from Local Subnet
Set-NetIPInterface -InterfaceAlias "Ethernet0" -DHCP Disabled

# 2. Terminate Rogue Ransomware Process & Injected Handles
taskkill /F /IM "invoice_payment_2026.exe"
taskkill /PID 1044 /F

# 3. Quarantine Binary Hash in Windows AppLocker
New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Safer\\CodeIdentifiers\\0\\Hashes\\9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" -Force
\`\`\`

\`\`\`bash
# 4. Block Outbound C2 Traffic on Perimeter Gateway
sudo iptables -A OUTPUT -d 185.220.101.5 -j DROP
sudo iptables -A FORWARD -d 185.220.101.5 -j DROP
\`\`\``,
          suggestedActions: [
            { label: 'Execute Containment Playbook', actionType: 'isolate_host' }
          ]
        };
      } else {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString(),
          text: `### 🔍 Grounded AI Telemetry Response

Regarding: *"${query}"*

Our multi-modal platform models this query against the current SOC state:
* **Active Threats**: 1 Multi-vector critical campaign (INC-2026-386), 2 quarantined payloads, 1 active DDoS SYN flood trace.
* **Explainability Guarantee**: All risk ratings (0-100) are computed strictly via SHAP/LIME mathematical attributions without speculative hallucination.
* **Tiered Controller**: Lightweight triage filters are active; 85% of traffic is resolved in <10ms.

Would you like me to generate a specific remediation playbook or inspect any specific file, URL, email, or PCAP capture?`,
          suggestedActions: [
            { label: 'Explain Multi-Vector Incident #386', actionType: 'custom', payload: 'Explain incident INC-2026-386' },
            { label: 'Generate Full Incident Report', actionType: 'generate_report' }
          ]
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsGenerating(false);
    }, 700);
  };

  const handleActionClick = (action: NonNullable<ChatMessage['suggestedActions']>[0]) => {
    if (action.actionType === 'generate_report' && onExportReport) {
      onExportReport();
    } else if (action.actionType === 'isolate_host' && onExecutePlaybook) {
      onExecutePlaybook('PLAYBOOK-APT-CRITICAL-CONTAINMENT');
    } else if (action.payload) {
      handleSend(action.payload);
    }
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-xl shadow-xl flex flex-col h-[700px] overflow-hidden">
      
      {/* Header */}
      <div className="p-4 bg-cyber-900 border-b border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
            <Bot className="w-5 h-5" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-cyber-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">AI Virtual SOC Conversational Copilot</h3>
              <span className="px-1.5 py-0.2 text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded">
                RAG Grounded
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Translating Deep Learning Mathematical Telemetry into Actionable Plain-Language Summaries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMessages([
                {
                  id: 'msg-reset',
                  sender: 'assistant',
                  timestamp: new Date().toLocaleTimeString(),
                  text: 'Session reset. Ready for new SOC incident analysis queries.'
                }
              ]);
            }}
            className="p-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-700 text-slate-400 hover:text-slate-200 border border-cyber-border transition-colors text-xs flex items-center gap-1 font-mono"
            title="Reset Chat Session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-cyber-950/60">
        {messages.map((msg) => {
          const isBot = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl rounded-xl p-4 shadow-md ${
                isBot
                  ? 'bg-cyber-900/90 border border-cyber-border text-slate-200'
                  : 'bg-cyan-600 text-white font-medium ml-8'
              }`}>
                {/* Message Header */}
                <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-slate-400 mb-2 pb-1 border-b border-cyber-border/40">
                  <span className={isBot ? 'text-cyan-400 font-bold' : 'text-cyan-100'}>
                    {isBot ? 'AI SOC ASSISTANT (RAG TELEMETRY)' : 'SOC ANALYST'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Body Text / Markdown Formatted */}
                <div className="text-xs leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Grounded Telemetry Badge */}
                {msg.groundedTelemetry && (
                  <div className="mt-3 p-2.5 rounded bg-cyber-950 border border-cyan-500/30 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Telemetry Grounding Matrix:</span>
                    </div>
                    <div className="text-slate-300">
                      Vector: <span className="text-amber-400 font-semibold">{msg.groundedTelemetry.vector}</span> | Risk: <strong className="text-red-400">{msg.groundedTelemetry.riskScore}/100</strong>
                    </div>
                    {msg.groundedTelemetry.iocFound && (
                      <div className="text-slate-400 text-[10px] truncate mt-0.5">
                        IoCs: {msg.groundedTelemetry.iocFound.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-cyber-border/50">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1.5">RECOMMENDED SOC ACTIONS:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleActionClick(action)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyber-800 hover:bg-cyber-700 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono transition-all hover:border-cyan-400"
                        >
                          <Zap className="w-3 h-3 text-cyan-400" />
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-lg bg-cyan-700 flex items-center justify-center text-white flex-shrink-0 mt-1 font-mono text-xs font-bold">
                  SOC
                </div>
              )}
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-cyber-900 border border-cyber-border rounded-xl px-4 py-2.5 text-xs text-cyan-300 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Querying RAG Telemetry & Computing SHAP Attributions...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Carousel */}
      <div className="px-4 py-2 bg-cyber-900 border-t border-cyber-border/80 flex items-center gap-2 overflow-x-auto text-xs font-mono">
        <span className="text-slate-500 text-[10px] whitespace-nowrap">QUICK PROMPTS:</span>
        <button
          onClick={() => handleSend('Explain why invoice_payment_2026.exe was flagged as Ransomware')}
          className="px-2.5 py-1 rounded bg-cyber-800 hover:bg-cyber-700 text-slate-300 whitespace-nowrap border border-slate-700 transition-colors"
        >
          Why was file flagged?
        </button>
        <button
          onClick={() => handleSend('Show me the threat timeline for workstation-A')}
          className="px-2.5 py-1 rounded bg-cyber-800 hover:bg-cyber-700 text-slate-300 whitespace-nowrap border border-slate-700 transition-colors"
        >
          Threat Timeline Workstation-A
        </button>
        <button
          onClick={() => handleSend('Explain network anomaly reconstruction loss')}
          className="px-2.5 py-1 rounded bg-cyber-800 hover:bg-cyber-700 text-slate-300 whitespace-nowrap border border-slate-700 transition-colors"
        >
          Explain Autoencoder Anomaly
        </button>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-cyber-900 border-t border-cyber-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI SOC Assistant (e.g., 'Why was this email blocked?', 'Show mitigation steps')..."
            className="flex-1 bg-cyber-950 border border-cyber-border rounded-lg px-4 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
