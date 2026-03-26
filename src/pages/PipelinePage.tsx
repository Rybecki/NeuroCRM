import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Plus, 
  MoreVertical, 
  Sparkles, 
  TrendingUp,
  Clock,
  DollarSign,
  Filter,
  LayoutGrid,
  List
} from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_DEALS } from '../constants';
import { cn } from '@/src/lib/utils';
import { Deal } from '../types';
import { readStorage, STORAGE_KEYS, writeStorage } from '../lib/localStorage';

const STAGES = ['Discovery', 'Proposal', 'Negotiation', 'Closed'];

export const PipelinePage: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(() => readStorage(STORAGE_KEYS.deals, MOCK_DEALS));
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [presetStage, setPresetStage] = useState<Deal['stage']>('Discovery');
  const [form, setForm] = useState({ title: '', customer: '', value: '', aiPrediction: 'Medium' as Deal['aiPrediction'] });

  useEffect(() => {
    writeStorage(STORAGE_KEYS.deals, deals);
  }, [deals]);

  useEffect(() => {
    const seedKey = 'neurocrm:deals:seed-v2';
    const wasSeeded = readStorage<boolean>(seedKey, false);
    if (!wasSeeded) {
      setDeals(MOCK_DEALS);
      writeStorage(STORAGE_KEYS.deals, MOCK_DEALS);
      writeStorage(seedKey, true);
    }
  }, []);

  const getDealsByStage = (stage: string) => deals.filter(d => d.stage === stage);
  const openDealForm = (stage: Deal['stage']) => {
    setPresetStage(stage);
    setIsNewDealOpen(true);
  };

  const createDeal = () => {
    if (!form.title.trim() || !form.customer.trim() || !form.value.trim()) return;
    const value = Number(form.value);
    if (Number.isNaN(value)) return;
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title: form.title.trim(),
      customer: form.customer.trim(),
      value,
      stage: presetStage,
      probability: form.aiPrediction === 'High' ? 80 : form.aiPrediction === 'Medium' ? 55 : 25,
      aiPrediction: form.aiPrediction,
    };
    setDeals((prev) => [newDeal, ...prev]);
    setForm({ title: '', customer: '', value: '', aiPrediction: 'Medium' });
    setIsNewDealOpen(false);
  };

  const moveDealToStage = (dealId: string, nextStage: Deal['stage']) => {
    setDeals((prev) => prev.map((deal) => (deal.id === dealId ? { ...deal, stage: nextStage } : deal)));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Sales Pipeline</h1>
          <p className="text-slate-400 mt-1">Visualize and manage your deal flow with AI predictions.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
            <button className="p-1.5 bg-white/10 rounded-lg text-white"><LayoutGrid className="w-4 h-4" /></button>
            <button className="p-1.5 text-slate-500 hover:text-white"><List className="w-4 h-4" /></button>
          </div>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button onClick={() => openDealForm('Discovery')} className="px-4 py-2 bg-electric-blue text-graphite-900 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Deal
          </button>
        </div>
      </div>
      {isNewDealOpen && (
        <GlassCard title={`Add Deal (${presetStage})`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Deal title" className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm" />
            <input value={form.customer} onChange={(e) => setForm((p) => ({ ...p, customer: e.target.value }))} placeholder="Customer" className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm" />
            <input value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} placeholder="Value (USD)" className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm" />
            <select value={form.aiPrediction} onChange={(e) => setForm((p) => ({ ...p, aiPrediction: e.target.value as Deal['aiPrediction'] }))} className="app-select rounded-xl py-2 px-3 text-sm">
              {['High', 'Medium', 'Low'].map((val) => <option key={val}>{val}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-end mt-4">
            <div className="flex gap-2">
            <button onClick={() => setIsNewDealOpen(false)} className="px-3 py-2 text-sm bg-white/5 rounded-xl">Cancel</button>
            <button onClick={createDeal} className="px-3 py-2 text-sm bg-electric-blue text-graphite-900 rounded-xl font-bold">Save Deal</button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-280px)] overflow-x-auto pb-4 no-scrollbar">
        {STAGES.map((stage) => (
          <div key={stage} className="flex flex-col gap-4 min-w-[280px]">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">{stage}</h3>
                <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-full border border-white/10">
                  {getDealsByStage(stage).length}
                </span>
              </div>
              <span className="text-xs font-bold text-electric-blue">
                ${(getDealsByStage(stage).reduce((acc, d) => acc + d.value, 0) / 1000).toFixed(0)}k
              </span>
            </div>

            <div
              className="flex-1 bg-white/[0.02] rounded-2xl border border-white/5 p-3 space-y-3 overflow-y-auto custom-scrollbar"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dealId = e.dataTransfer.getData('text/deal-id') || draggedDealId;
                if (dealId) moveDealToStage(dealId, stage as Deal['stage']);
                setDraggedDealId(null);
              }}
            >
              {getDealsByStage(stage).map((deal) => (
                <motion.div
                  key={deal.id}
                  layoutId={deal.id}
                  className="glass-card p-4 cursor-grab active:cursor-grabbing group"
                  draggable
                  onDragStart={(e) => {
                    setDraggedDealId(deal.id);
                    e.dataTransfer.setData('text/deal-id', deal.id);
                  }}
                  onDragEnd={() => setDraggedDealId(null)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-electric-blue transition-colors line-clamp-1">{deal.title}</h4>
                    <button className="text-slate-500 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                  
                  <p className="text-xs text-slate-400 mb-4">{deal.customer}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-white font-bold">
                      <DollarSign className="w-3 h-3 text-emerald-400" />
                      {(deal.value / 1000).toFixed(0)}k
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" /> 12d
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex -space-x-2">
                      <img src={`https://picsum.photos/seed/${deal.id}/40/40`} className="w-6 h-6 rounded-full border border-graphite-900" alt="" referrerPolicy="no-referrer" />
                      <div className="w-6 h-6 rounded-full bg-white/5 border border-graphite-900 flex items-center justify-center text-[8px] text-slate-400">+2</div>
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                      deal.aiPrediction === 'High' ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" :
                      deal.aiPrediction === 'Medium' ? "bg-amber-400/10 text-amber-400 border-amber-400/20" :
                      "bg-rose-400/10 text-rose-400 border-rose-400/20"
                    )}>
                      <Sparkles className="w-2.5 h-2.5" />
                      {deal.aiPrediction}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <button onClick={() => openDealForm(stage as Deal['stage'])} className="w-full py-3 border border-dashed border-white/10 rounded-xl text-xs text-slate-500 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2">
                <Plus className="w-3 h-3" /> Add Card
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex-row items-center gap-4">
          <div className="p-3 bg-emerald-400/10 text-emerald-400 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Win Rate</p>
            <h3 className="text-xl font-bold text-white">64.2%</h3>
          </div>
        </GlassCard>
        <GlassCard className="flex-row items-center gap-4">
          <div className="p-3 bg-electric-blue/10 text-electric-blue rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Pipeline Value</p>
            <h3 className="text-xl font-bold text-white">$4.8M</h3>
          </div>
        </GlassCard>
        <GlassCard className="flex-row items-center gap-4">
          <div className="p-3 bg-neon-purple/10 text-neon-purple rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Avg. Cycle</p>
            <h3 className="text-xl font-bold text-white">42 Days</h3>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
