import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  Mail,
  FileText,
  Search,
  Plus,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
  insight?: {
    title: string;
    value: string;
    trend: string;
  };
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello Alex! I've analyzed your pipeline for today. You have 3 high-probability deals that need attention. How can I assist you?",
    timestamp: '10:00 AM',
    suggestions: [
      'Draft follow-up for Cyberdyne',
      'Analyze churn risk for Black Mesa',
      'Generate weekly sales report'
    ]
  }
];

export const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I've prepared a draft for Cyberdyne Systems. Based on their recent engagement, I've highlighted the 15% discount we discussed in the last meeting. Would you like to review the email?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        insight: {
          title: 'Predicted Close Date',
          value: 'April 12, 2024',
          trend: '85% Confidence'
        }
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-purple to-electric-blue flex items-center justify-center shadow-[0_0_20px_rgba(188,19,254,0.3)]">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Neuro AI Assistant</h1>
            <p className="text-slate-400 text-sm">Your intelligent sales co-pilot.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors">
            <Plus className="w-4 h-4" /> New Session
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden relative">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar"
          >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex gap-4 max-w-[85%]',
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border',
                  msg.role === 'assistant'
                    ? 'bg-neon-purple/10 border-neon-purple/20 text-neon-purple'
                    : 'bg-electric-blue/10 border-electric-blue/20 text-electric-blue'
                )}>
                  {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className="space-y-3">
                  <div className={cn(
                    'p-4 rounded-2xl text-sm leading-relaxed',
                    msg.role === 'assistant'
                      ? 'bg-white/5 border border-white/10 text-slate-200'
                      : 'bg-electric-blue text-graphite-900 font-medium'
                  )}>
                    {msg.content}
                  </div>

                  {msg.insight && (
                    <div className="p-4 rounded-2xl bg-neon-purple/10 border border-neon-purple/20">
                      <p className="text-[10px] font-bold text-neon-purple uppercase tracking-widest mb-1">AI Prediction</p>
                      <h4 className="text-sm font-bold text-white">{msg.insight.title}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-white">{msg.insight.value}</span>
                        <span className="text-xs text-emerald-400 font-bold">{msg.insight.trend}</span>
                      </div>
                    </div>
                  )}

                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-2">
                      {msg.suggestions.map((s, i) => (
                        <button key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className={cn('text-[10px] text-slate-500', msg.role === 'user' ? 'text-right' : '')}>{msg.timestamp}</p>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-neon-purple/10 border border-neon-purple/20 text-neon-purple flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-1">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/5 bg-white/[0.02]">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Neuro anything... (e.g., 'Draft follow-up for Cyberdyne')"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm focus:outline-none focus:border-neon-purple/50 focus:bg-white/10 transition-all"
              />
              <button
                onClick={handleSend}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-neon-purple text-white rounded-xl hover:shadow-[0_0_15px_rgba(188,19,254,0.5)] transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400" /> Real-time Analysis</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-electric-blue" /> Email Integration</span>
              <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-neon-purple" /> Document Parsing</span>
            </div>
          </div>
        </GlassCard>

        <div className="w-80 space-y-6 hidden xl:block">
          <GlassCard title="Suggested Actions">
            <div className="space-y-3 mt-2">
              {[
                { label: 'Draft Email', icon: Mail, color: 'text-electric-blue' },
                { label: 'Generate Report', icon: FileText, color: 'text-neon-purple' },
                { label: 'Analyze Deal', icon: Zap, color: 'text-amber-400' },
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all group text-left">
                  <div className="flex items-center gap-3">
                    <action.icon className={cn('w-4 h-4', action.color)} />
                    <span className="text-sm font-medium text-slate-200">{action.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard title="Contextual Data">
            <div className="space-y-4 mt-2">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Active Deal</p>
                <h4 className="text-sm font-bold text-white">Cyberdyne Systems</h4>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-slate-400">Value</span>
                  <span className="text-xs text-white font-bold">$250,000</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full mt-3">
                  <div className="h-full w-[85%] bg-electric-blue rounded-full"></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Last Interaction</p>
                <p className="text-xs text-slate-300">Video call with Alex Rivera regarding security compliance.</p>
                <p className="text-[10px] text-slate-500 mt-2">2 hours ago</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
