import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Calendar,
  Download,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { cn } from '@/src/lib/utils';
import { jsPDF } from 'jspdf';

const revenueData = [
  { name: 'Jan', current: 4000, previous: 2400 },
  { name: 'Feb', current: 3000, previous: 1398 },
  { name: 'Mar', current: 2000, previous: 9800 },
  { name: 'Apr', current: 2780, previous: 3908 },
  { name: 'May', current: 1890, previous: 4800 },
  { name: 'Jun', current: 2390, previous: 3800 },
  { name: 'Jul', current: 3490, previous: 4300 },
];

const churnData = [
  { name: 'Product A', value: 400 },
  { name: 'Product B', value: 300 },
  { name: 'Product C', value: 300 },
  { name: 'Product D', value: 200 },
];

const COLORS = ['#00f2ff', '#bc13fe', '#00ffff', '#1c1c21'];

const radarData = [
  { subject: 'Sales', A: 120, B: 110, fullMark: 150 },
  { subject: 'Marketing', A: 98, B: 130, fullMark: 150 },
  { subject: 'Support', A: 86, B: 130, fullMark: 150 },
  { subject: 'Product', A: 99, B: 100, fullMark: 150 },
  { subject: 'Success', A: 85, B: 90, fullMark: 150 },
  { subject: 'Dev', A: 65, B: 85, fullMark: 150 },
];

const KPI_STATS = [
  { label: 'Avg. Deal Size', value: '$42.5k', trend: '+8.2%', icon: BarChart3 },
  { label: 'Customer LTV', value: '$128k', trend: '+12.5%', icon: Users },
  { label: 'CAC', value: '$4.2k', trend: '-2.4%', icon: TrendingUp },
  { label: 'Churn Rate', value: '1.2%', trend: '-0.5%', icon: Activity },
];

export const AnalyticsPage: React.FC = () => {
  const handleExportPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    const colors = {
      graphite: [20, 20, 26] as const,
      panel: [28, 28, 35] as const,
      border: [57, 57, 71] as const,
      text: [245, 247, 255] as const,
      muted: [148, 163, 184] as const,
      cyan: [0, 242, 255] as const,
      purple: [188, 19, 254] as const,
      green: [52, 211, 153] as const,
      red: [244, 63, 94] as const,
    };

    // Background
    doc.setFillColor(...colors.graphite);
    doc.rect(0, 0, pageWidth, 842, 'F');

    // Header band
    doc.setFillColor(...colors.panel);
    doc.roundedRect(24, 24, pageWidth - 48, 86, 12, 12, 'F');
    doc.setDrawColor(...colors.border);
    doc.roundedRect(24, 24, pageWidth - 48, 86, 12, 12, 'S');

    // Neon accent lines
    doc.setDrawColor(...colors.cyan);
    doc.setLineWidth(2);
    doc.line(36, 36, 120, 36);
    doc.setDrawColor(...colors.purple);
    doc.line(pageWidth - 120, 36, pageWidth - 36, 36);

    // Header text
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('NEURO CRM', 36, 66);
    doc.setFontSize(14);
    doc.text('Advanced Analytics Report', 36, 88);

    doc.setTextColor(...colors.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 220, 66);
    doc.text('Period: Last 30 Days', pageWidth - 220, 84);

    const cards = [
      { ...KPI_STATS[0], icon: 'DS', accent: colors.cyan },
      { ...KPI_STATS[1], icon: 'LTV', accent: colors.purple },
      { ...KPI_STATS[2], icon: 'CAC', accent: colors.cyan },
      { ...KPI_STATS[3], icon: 'CH', accent: colors.purple },
    ];

    const startX = 24;
    const startY = 140;
    const gap = 14;
    const cardWidth = (pageWidth - 48 - gap) / 2;
    const cardHeight = 100;

    cards.forEach((card, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = startX + col * (cardWidth + gap);
      const y = startY + row * (cardHeight + gap);
      const trendIsPositive = card.trend.startsWith('+');

      doc.setFillColor(...colors.panel);
      doc.roundedRect(x, y, cardWidth, cardHeight, 10, 10, 'F');
      doc.setDrawColor(...colors.border);
      doc.roundedRect(x, y, cardWidth, cardHeight, 10, 10, 'S');

      doc.setFillColor(card.accent[0], card.accent[1], card.accent[2]);
      doc.roundedRect(x, y, cardWidth, 5, 10, 10, 'F');

      doc.setFillColor(40, 40, 50);
      doc.circle(x + 24, y + 26, 14, 'F');

      doc.setTextColor(...colors.text);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(card.icon, x + 16, y + 29);

      doc.setFontSize(10);
      doc.setTextColor(...colors.muted);
      doc.text(card.label.toUpperCase(), x + 46, y + 30);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.text);
      doc.setFontSize(24);
      doc.text(card.value, x + 14, y + 66);

      doc.setFontSize(11);
      const trendColor = trendIsPositive ? colors.green : colors.red;
      doc.setTextColor(trendColor[0], trendColor[1], trendColor[2]);
      doc.text(`${trendIsPositive ? 'UP' : 'DOWN'} ${card.trend}`, x + 14, y + 86);
    });

    // Insights footer panel
    const panelY = 370;
    doc.setFillColor(...colors.panel);
    doc.roundedRect(24, panelY, pageWidth - 48, 150, 12, 12, 'F');
    doc.setDrawColor(...colors.border);
    doc.roundedRect(24, panelY, pageWidth - 48, 150, 12, 12, 'S');

    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Executive Snapshot', 38, panelY + 26);

    doc.setTextColor(...colors.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('- Avg. Deal Size remains strong with consistent momentum.', 38, panelY + 52);
    doc.text('- Customer LTV growth outpaces CAC, indicating healthy acquisition.', 38, panelY + 74);
    doc.text('- Churn stays low, with strongest retention in enterprise accounts.', 38, panelY + 96);
    doc.text('- Team performance trend suggests stable pipeline execution.', 38, panelY + 118);

    doc.setFontSize(9);
    doc.text('Neuro CRM Analytics Engine', 38, 812);
    doc.text('Page 1 / 1', pageWidth - 90, 812);
    doc.save(`advanced-analytics-${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Advanced Analytics</h1>
          <p className="text-slate-400 mt-1">Deep dive into your business performance and predictions.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </button>
          <button onClick={handleExportPdf} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {KPI_STATS.map((stat, i) => (
          <GlassCard key={i} className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg text-electric-blue">
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5",
                stat.trend.startsWith('+') ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
              )}>
                {stat.trend.startsWith('+') ? <ArrowUpRight className="w-2 h-2" /> : <ArrowDownRight className="w-2 h-2" />}
                {stat.trend}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trends */}
        <GlassCard title="Revenue Trends" subtitle="Current vs Previous Period" className="lg:col-span-2">
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
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
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1c1c21', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Line type="monotone" dataKey="current" stroke="#00f2ff" strokeWidth={3} dot={{ fill: '#00f2ff', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="previous" stroke="#bc13fe" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Churn Prediction */}
        <GlassCard title="Churn Risk by Product" icon={<PieChartIcon className="w-4 h-4" />}>
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={churnData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {churnData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1c1c21', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {churnData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cohort Analysis */}
        <GlassCard title="Cohort Retention" subtitle="User retention by signup month">
          <div className="mt-4 overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cohort</th>
                  <th className="p-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Size</th>
                  {[1, 2, 3, 4, 5, 6].map(m => (
                    <th key={m} className="p-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">M{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['Jan', 'Feb', 'Mar', 'Apr'].map((month, i) => (
                  <tr key={month} className="border-t border-white/5">
                    <td className="p-2 text-xs font-bold text-white">{month} 2024</td>
                    <td className="p-2 text-xs text-slate-400">1,240</td>
                    {[100, 85, 72, 64, 58, 52].map((val, j) => (
                      <td key={j} className="p-1">
                        <div 
                          className="h-8 rounded flex items-center justify-center text-[10px] font-bold text-white"
                          style={{ 
                            backgroundColor: `rgba(0, 242, 255, ${val / 100})`,
                            opacity: 1 - (i * 0.1)
                          }}
                        >
                          {val - (i * 2)}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Team Performance */}
        <GlassCard title="Team Performance" subtitle="Multi-dimensional analysis">
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis hide />
                <Radar name="Team A" dataKey="A" stroke="#00f2ff" fill="#00f2ff" fillOpacity={0.3} />
                <Radar name="Team B" dataKey="B" stroke="#bc13fe" fill="#bc13fe" fillOpacity={0.3} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1c1c21', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
