import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  TrendingUp, 
  Users, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Briefcase
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { MOCK_INSIGHTS, MOCK_ACTIVITIES } from '../constants';
import { Deal } from '../types';
import { readStorage, STORAGE_KEYS, writeStorage } from '../lib/localStorage';

const data = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 },
  { name: 'May', revenue: 55000 },
  { name: 'Jun', revenue: 67000 },
  { name: 'Jul', revenue: 72000 },
];

const funnelData = [
  { name: 'Leads', value: 400, color: '#00f2ff' },
  { name: 'Contacted', value: 300, color: '#00d2ff' },
  { name: 'Qualified', value: 200, color: '#bc13fe' },
  { name: 'Proposal', value: 100, color: '#a013fe' },
  { name: 'Closed', value: 50, color: '#8013fe' },
];

const KPI_CARDS = [
  { title: 'Total Revenue', value: '$1.2M', trend: '+12.5%', isUp: true, icon: TrendingUp },
  { title: 'Active Customers', value: '1,284', trend: '+5.2%', isUp: true, icon: Users },
  { title: 'Conversion Rate', value: '3.4%', trend: '-0.8%', isUp: false, icon: Target },
];

export const DashboardPage: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(() => readStorage(STORAGE_KEYS.deals, []));
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    customer: '',
    value: '',
    stage: 'Discovery' as Deal['stage'],
    aiPrediction: 'Medium' as Deal['aiPrediction'],
  });

  useEffect(() => {
    writeStorage(STORAGE_KEYS.deals, deals);
  }, [deals]);

  const handleCreateDeal = () => {
    if (!form.title.trim() || !form.customer.trim() || !form.value.trim()) return;
    const value = Number(form.value);
    if (Number.isNaN(value)) return;

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title: form.title.trim(),
      customer: form.customer.trim(),
      value,
      stage: form.stage,
      probability: form.aiPrediction === 'High' ? 80 : form.aiPrediction === 'Medium' ? 55 : 25,
      aiPrediction: form.aiPrediction,
    };

    setDeals((prev) => [newDeal, ...prev]);
    setForm({ title: '', customer: '', value: '', stage: 'Discovery', aiPrediction: 'Medium' });
    setIsNewDealOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, Alex. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
            Download Report
          </button>
          <button
            onClick={() => setIsNewDealOpen(true)}
            className="px-4 py-2 bg-electric-blue text-graphite-900 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all"
          >
            + New Deal
          </button>
        </div>
      </div>

      {isNewDealOpen && (
        <GlassCard title="Add New Deal">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-2">
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Deal title" className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm" />
            <input value={form.customer} onChange={(e) => setForm((p) => ({ ...p, customer: e.target.value }))} placeholder="Customer" className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm" />
            <input value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} placeholder="Value (USD)" className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm" />
            <select value={form.stage} onChange={(e) => setForm((p) => ({ ...p, stage: e.target.value as Deal['stage'] }))} className="app-select rounded-xl py-2 px-3 text-sm">
              {['Discovery', 'Proposal', 'Negotiation', 'Closed'].map((stage) => <option key={stage}>{stage}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-end mt-4">
            <div className="flex gap-2">
              <button onClick={() => setIsNewDealOpen(false)} className="px-3 py-2 text-sm bg-white/5 rounded-xl">Cancel</button>
              <button onClick={handleCreateDeal} className="px-3 py-2 text-sm bg-electric-blue text-graphite-900 rounded-xl font-bold">Save Deal</button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {KPI_CARDS.map((kpi, idx) => (
          <GlassCard key={idx} className="relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-400 font-medium">{kpi.title}</p>
                <h2 className="text-3xl font-bold text-white mt-1">{kpi.value}</h2>
                <div className={cn(
                  "flex items-center gap-1 mt-2 text-xs font-bold",
                  kpi.isUp ? "text-emerald-400" : "text-rose-400"
                )}>
                  {kpi.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.trend}
                  <span className="text-slate-500 font-normal ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl text-electric-blue group-hover:scale-110 transition-transform">
                <kpi.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-electric-blue/5 rounded-full blur-3xl"></div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <GlassCard title="Revenue Growth" subtitle="Monthly performance overview" className="lg:col-span-2">
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1c1c21', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#00f2ff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00f2ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* AI Insights */}
        <GlassCard title="AI Insights" icon={<Sparkles className="w-5 h-5" />} className="h-full">
          <div className="space-y-4 mt-2">
            {MOCK_INSIGHTS.map((insight) => (
              <div key={insight.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5 shrink-0",
                    insight.type === 'opportunity' ? "bg-electric-blue shadow-[0_0_8px_rgba(0,242,255,0.6)]" :
                    insight.type === 'warning' ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "bg-slate-400"
                  )}></div>
                  <div>
                    <p className="text-sm text-slate-200 leading-relaxed">{insight.message}</p>
                    <button className="text-xs font-bold text-electric-blue mt-2 hover:underline">
                      {insight.action} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Funnel */}
        <GlassCard title="Sales Funnel" subtitle="Conversion by stage">
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#1c1c21', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard title="Activity Timeline" className="lg:col-span-2">
          <div className="space-y-6 mt-4">
            {MOCK_ACTIVITIES.map((activity, idx) => (
              <div key={activity.id} className="relative flex gap-4">
                {idx !== MOCK_ACTIVITIES.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-[-24px] w-px bg-white/10"></div>
                )}
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {activity.type === 'deal' && <Briefcase className="w-4 h-4 text-emerald-400" />}
                  {activity.type === 'email' && <Mail className="w-4 h-4 text-electric-blue" />}
                  {activity.type === 'meeting' && <Calendar className="w-4 h-4 text-neon-purple" />}
                  {activity.type === 'call' && <Phone className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-slate-200">
                      <span className="font-bold text-white">{activity.user}</span> {activity.action} <span className="font-bold text-white">{activity.target}</span>
                    </p>
                    <span className="text-xs text-slate-500">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
