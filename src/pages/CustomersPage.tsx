import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  Plus,
  Mail,
  Phone,
  Calendar,
  Tag,
  Star,
  Network,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { MOCK_CUSTOMERS } from '../constants';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { Customer } from '../types';
import { readStorage, STORAGE_KEYS, writeStorage } from '../lib/localStorage';
import { Sparkles } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(() => readStorage(STORAGE_KEYS.customers, MOCK_CUSTOMERS));
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(customers[0]);
  const [view, setView] = useState<'list' | 'profile'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', status: 'Lead' as Customer['status'] });
  const graphRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.customers, customers);
  }, [customers]);

  useEffect(() => {
    if (!selectedCustomer && customers.length) setSelectedCustomer(customers[0]);
  }, [customers, selectedCustomer]);

  const handleAddCustomer = () => {
    if (!form.name.trim() || !form.company.trim() || !form.email.trim()) return;
    const customer: Customer = {
      id: `customer-${Date.now()}`,
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      status: form.status,
      score: 60,
      lastInteraction: new Date().toISOString(),
      tags: ['New'],
      avatar: `https://picsum.photos/seed/${encodeURIComponent(form.email)}/100/100`,
    };
    setCustomers((prev) => [customer, ...prev]);
    setSelectedCustomer(customer);
    setView('list');
    setForm({ name: '', company: '', email: '', status: 'Lead' });
    setIsAddOpen(false);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (view === 'profile' && graphRef.current) {
      const width = 400;
      const height = 300;
      const svg = d3.select(graphRef.current);
      svg.selectAll("*").remove();

      const nodes = [
        { id: selectedCustomer.name, group: 1, size: 20 },
        { id: 'Sarah Chen', group: 2, size: 12 },
        { id: 'Cyberdyne', group: 3, size: 15 },
        { id: 'Project X', group: 4, size: 10 },
        { id: 'Marketing', group: 2, size: 8 },
      ];

      const links = [
        { source: selectedCustomer.name, target: 'Sarah Chen' },
        { source: selectedCustomer.name, target: 'Cyberdyne' },
        { source: 'Cyberdyne', target: 'Project X' },
        { source: 'Sarah Chen', target: 'Marketing' },
      ];

      const simulation = d3.forceSimulation(nodes as any)
        .force("link", d3.forceLink(links).id((d: any) => d.id).distance(80))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2));

      const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "rgba(255,255,255,0.1)")
        .attr("stroke-width", 1);

      const node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", (d: any) => d.size)
        .attr("fill", (d: any) => d.group === 1 ? "#00f2ff" : d.group === 2 ? "#bc13fe" : "#1c1c21")
        .attr("stroke", "rgba(255,255,255,0.2)")
        .attr("stroke-width", 2);

      node.append("title").text((d: any) => d.id);

      simulation.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);

        node
          .attr("cx", (d: any) => d.x)
          .attr("cy", (d: any) => d.y);
      });
    }
  }, [view, selectedCustomer]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Customer Intelligence</h1>
          <p className="text-slate-400 mt-1">Manage and analyze your customer relationships.</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-electric-blue text-graphite-900 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>
      {isAddOpen && (
        <GlassCard title="Add Customer">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm" />
            <input value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} placeholder="Company" className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm" />
            <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm" />
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as Customer['status'] }))} className="app-select rounded-xl py-2 px-3 text-sm">
              {['Lead', 'Active', 'Inactive', 'Churned'].map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setIsAddOpen(false)} className="px-3 py-2 text-sm bg-white/5 rounded-xl">Cancel</button>
            <button onClick={handleAddCustomer} className="px-3 py-2 text-sm bg-electric-blue text-graphite-900 rounded-xl font-bold">Save</button>
          </div>
        </GlassCard>
      )}

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Filter customers by name, company, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-electric-blue/50 transition-all"
                />
              </div>
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors">
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>

            <GlassCard className="p-0 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Company</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">AI Score</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Last Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCustomers.map((customer) => (
                    <tr 
                      key={customer.id} 
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setView('profile');
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={customer.avatar} className="w-10 h-10 rounded-xl object-cover border border-white/10" alt="" referrerPolicy="no-referrer" />
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-electric-blue transition-colors">{customer.name}</p>
                            <p className="text-xs text-slate-500">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-300">{customer.company}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                          customer.status === 'Active' ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" :
                          customer.status === 'Lead' ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20" :
                          "bg-slate-400/10 text-slate-400 border-slate-400/20"
                        )}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/5 relative">
                          <span className="text-xs font-bold text-white">{customer.score}</span>
                          <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle 
                              cx="20" cy="20" r="18" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              className="text-white/5"
                            />
                            <circle 
                              cx="20" cy="20" r="18" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeDasharray={113}
                              strokeDashoffset={113 - (113 * customer.score) / 100}
                              className="text-electric-blue"
                            />
                          </svg>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-400">2 days ago</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-500 hover:text-white transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!filteredCustomers.length && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                        No users found for this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: Basic Info */}
            <div className="space-y-6">
              <button 
                onClick={() => setView('list')}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4"
              >
                <ChevronRight className="w-4 h-4 rotate-180" /> Back to list
              </button>
              
              <GlassCard className="text-center">
                <div className="relative inline-block mx-auto">
                  <img src={selectedCustomer.avatar} className="w-24 h-24 rounded-3xl object-cover border-2 border-electric-blue/30 p-1" alt="" referrerPolicy="no-referrer" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full border-4 border-graphite-800 flex items-center justify-center">
                    <Star className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mt-4">{selectedCustomer.name}</h2>
                <p className="text-slate-400">{selectedCustomer.company}</p>
                
                <div className="flex justify-center gap-2 mt-6">
                  <button className="p-3 bg-white/5 rounded-xl text-electric-blue hover:bg-electric-blue/10 transition-colors">
                    <Mail className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-white/5 rounded-xl text-emerald-400 hover:bg-emerald-400/10 transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-white/5 rounded-xl text-neon-purple hover:bg-neon-purple/10 transition-colors">
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
              </GlassCard>

              <GlassCard title="AI Summary" icon={<Sparkles className="w-4 h-4" />}>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "Alex is a key decision maker at Cyberdyne. They are currently evaluating our AI suite for their 2025 infrastructure overhaul. High probability of expansion if we address their security concerns by Q3."
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                  {selectedCustomer.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Middle Column: Relationship & Timeline */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard title="Relationship Network" icon={<Network className="w-4 h-4" />}>
                  <div className="h-[300px] flex items-center justify-center">
                    <svg ref={graphRef} width="400" height="300" className="max-w-full"></svg>
                  </div>
                </GlassCard>
                
                <GlassCard title="Lead Scoring" icon={<Star className="w-4 h-4" />}>
                  <div className="space-y-4 mt-2">
                    {[
                      { label: 'Engagement', value: 85, color: 'bg-electric-blue' },
                      { label: 'Budget Fit', value: 95, color: 'bg-emerald-400' },
                      { label: 'Authority', value: 70, color: 'bg-neon-purple' },
                      { label: 'Timeline', value: 40, color: 'bg-amber-400' },
                    ].map(metric => (
                      <div key={metric.label}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-400">{metric.label}</span>
                          <span className="text-white font-bold">{metric.value}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            className={cn("h-full rounded-full", metric.color)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              <GlassCard title="Interaction Timeline">
                <div className="space-y-6 mt-4">
                  {[
                    { date: 'Mar 24', title: 'Product Demo', type: 'meeting', desc: 'Showcased the new analytics module. Positive feedback.' },
                    { date: 'Mar 20', title: 'Email Thread', type: 'email', desc: 'Discussed pricing tiers and enterprise licensing.' },
                    { date: 'Mar 15', title: 'Discovery Call', type: 'call', desc: 'Initial requirements gathering for Cyberdyne project.' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-6 group">
                      <div className="text-xs font-bold text-slate-500 w-12 pt-1 uppercase tracking-tighter">{item.date}</div>
                      <div className="relative flex-1 pb-6 border-l border-white/10 pl-6">
                        <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-graphite-900 border-2 border-electric-blue group-hover:scale-125 transition-transform"></div>
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
