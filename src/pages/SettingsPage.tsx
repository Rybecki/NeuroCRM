import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Database, 
  Zap, 
  ChevronRight,
  Plus,
  Mail,
  Lock,
  Smartphone
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { readStorage, STORAGE_KEYS, writeStorage } from '../lib/localStorage';

type SettingsSection = 'Profile' | 'Team' | 'Notifications' | 'Integrations' | 'Security' | 'Billing';

type TeamMember = { name: string; role: string; email: string; status: 'Active' | 'Pending' };
type Integration = { name: string; desc: string; icon: typeof Mail; connected: boolean };

type SettingsState = {
  activeSection: SettingsSection;
  profile: { fullName: string; email: string; jobTitle: string; timezone: string; avatarSeed: string };
  notifications: { email: boolean; sms: boolean; weeklyDigest: boolean };
  security: { twoFactor: boolean; sessionTimeout: string };
  billing: { autoRenew: boolean; plan: string };
  team: TeamMember[];
  integrations: Integration[];
};

export const SettingsPage: React.FC = () => {
  const initialSettings: SettingsState = {
    activeSection: 'Profile',
    profile: {
      fullName: 'Alex Rivera',
      email: 'alex@neurocrm.ai',
      jobTitle: 'Head of Sales',
      timezone: 'Pacific Time (PT)',
      avatarSeed: 'alex',
    },
    notifications: { email: true, sms: false, weeklyDigest: true },
    security: { twoFactor: false, sessionTimeout: '30 minutes' },
    billing: { autoRenew: true, plan: 'Pro' },
    team: [
      { name: 'Sarah Chen', role: 'Admin', email: 'sarah@neurocrm.ai', status: 'Active' },
      { name: 'Marcus Thorne', role: 'Editor', email: 'marcus@neurocrm.ai', status: 'Active' },
      { name: 'Elena Vance', role: 'Viewer', email: 'elena@neurocrm.ai', status: 'Pending' },
    ],
    integrations: [
      { name: 'Slack', desc: 'Real-time notifications', icon: Mail, connected: true },
      { name: 'Google Calendar', desc: 'Sync meetings & events', icon: Globe, connected: true },
      { name: 'Salesforce', desc: 'Import legacy data', icon: Database, connected: false },
      { name: 'Zapier', desc: 'Automate workflows', icon: Zap, connected: false },
    ],
  };

  const [settings, setSettings] = useState<SettingsState>(() => readStorage(STORAGE_KEYS.settings, initialSettings));
  const [savedAt, setSavedAt] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    writeStorage(STORAGE_KEYS.settings, settings);
  }, [settings]);

  const updateSection = (section: SettingsSection) => setSettings((prev) => ({ ...prev, activeSection: section }));
  const saveSettings = () => setSavedAt(new Date().toLocaleTimeString());
  const discardChanges = () => setSettings(readStorage(STORAGE_KEYS.settings, initialSettings));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-slate-400 mt-1">Configure your workspace, team, and integrations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="space-y-2">
          {[
            { label: 'Profile', icon: User, active: true },
            { label: 'Team', icon: Shield },
            { label: 'Notifications', icon: Bell },
            { label: 'Integrations', icon: Zap },
            { label: 'Security', icon: Lock },
            { label: 'Billing', icon: Database },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => updateSection(item.label as SettingsSection)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
                settings.activeSection === item.label
                  ? "bg-electric-blue/10 text-electric-blue border border-electric-blue/20" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-8">
          {settings.activeSection === 'Profile' && (
          <GlassCard title="Profile Information" subtitle="Update your personal details and avatar">
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer">
                  <img src={`https://picsum.photos/seed/${settings.profile.avatarSeed}/100/100`} className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10 group-hover:border-electric-blue transition-colors" alt="" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <button onClick={() => setSettings((prev) => ({ ...prev, profile: { ...prev.profile, avatarSeed: `${prev.profile.avatarSeed}-${Date.now()}` } }))} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
                    Change Avatar
                  </button>
                  <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    value={settings.profile.fullName}
                    onChange={(e) => setSettings((prev) => ({ ...prev, profile: { ...prev.profile, fullName: e.target.value } }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-electric-blue/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    value={settings.profile.email}
                    onChange={(e) => setSettings((prev) => ({ ...prev, profile: { ...prev.profile, email: e.target.value } }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-electric-blue/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Job Title</label>
                  <input 
                    type="text" 
                    value={settings.profile.jobTitle}
                    onChange={(e) => setSettings((prev) => ({ ...prev, profile: { ...prev.profile, jobTitle: e.target.value } }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-electric-blue/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Timezone</label>
                  <select value={settings.profile.timezone} onChange={(e) => setSettings((prev) => ({ ...prev, profile: { ...prev.profile, timezone: e.target.value } }))} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-electric-blue/50 transition-all appearance-none">
                    <option>Pacific Time (PT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>Central European Time (CET)</option>
                  </select>
                </div>
              </div>
            </div>
          </GlassCard>
          )}

          {settings.activeSection === 'Team' && (
          <GlassCard title="Team Members" subtitle="Manage your team and their access levels">
            <div className="space-y-4 mt-4">
              {settings.team.map((member, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={`https://picsum.photos/seed/${member.name}/40/40`} className="w-10 h-10 rounded-xl object-cover" alt="" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-sm font-bold text-white">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <select value={member.role} onChange={(e) => setSettings((prev) => ({ ...prev, team: prev.team.map((m, idx) => idx === i ? { ...m, role: e.target.value } : m) }))} className="text-xs font-medium bg-white/5 border border-white/10 rounded px-2 py-1">
                      {['Admin', 'Editor', 'Viewer'].map((role) => <option key={role}>{role}</option>)}
                    </select>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                      member.status === 'Active' ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"
                    )}>
                      {member.status}
                    </span>
                    <button onClick={() => setSettings((prev) => ({ ...prev, team: prev.team.map((m, idx) => idx === i ? { ...m, status: m.status === 'Active' ? 'Pending' : 'Active' } : m) }))} className="p-2 text-slate-500 hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="new.member@neurocrm.ai" className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm" />
                <button onClick={() => {
                  if (!inviteEmail.trim()) return;
                  setSettings((prev) => ({ ...prev, team: [...prev.team, { name: inviteEmail.split('@')[0], role: 'Viewer', email: inviteEmail.trim(), status: 'Pending' }] }));
                  setInviteEmail('');
                }} className="px-3 py-2 border border-dashed border-white/10 rounded-xl text-xs text-slate-500 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2">
                <Plus className="w-3 h-3" /> Invite Member
                </button>
              </div>
            </div>
          </GlassCard>
          )}

          {settings.activeSection === 'Integrations' && (
          <GlassCard title="Connected Apps" subtitle="Sync data with your favorite tools">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {settings.integrations.map((app, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                      <app.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{app.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{app.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings((prev) => ({ ...prev, integrations: prev.integrations.map((a, idx) => idx === i ? { ...a, connected: !a.connected } : a) }))}
                    className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                    app.connected 
                      ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20" 
                      : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
                  )}>
                    {app.connected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
          )}

          {settings.activeSection === 'Notifications' && (
            <GlassCard title="Notifications" subtitle="Choose what updates you get">
              <div className="space-y-3 mt-4">
                {[
                  { key: 'email', label: 'Email notifications' },
                  { key: 'sms', label: 'SMS alerts' },
                  { key: 'weeklyDigest', label: 'Weekly digest' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-sm text-white">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications[item.key as keyof SettingsState['notifications']]}
                      onChange={(e) => setSettings((prev) => ({ ...prev, notifications: { ...prev.notifications, [item.key]: e.target.checked } }))}
                    />
                  </label>
                ))}
              </div>
            </GlassCard>
          )}

          {settings.activeSection === 'Security' && (
            <GlassCard title="Security" subtitle="Protect your workspace">
              <div className="space-y-4 mt-4">
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-sm text-white">Two-factor authentication</span>
                  <input type="checkbox" checked={settings.security.twoFactor} onChange={(e) => setSettings((prev) => ({ ...prev, security: { ...prev.security, twoFactor: e.target.checked } }))} />
                </label>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Session timeout</label>
                  <select value={settings.security.sessionTimeout} onChange={(e) => setSettings((prev) => ({ ...prev, security: { ...prev.security, sessionTimeout: e.target.value } }))} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm">
                    {['15 minutes', '30 minutes', '1 hour', '4 hours'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </GlassCard>
          )}

          {settings.activeSection === 'Billing' && (
            <GlassCard title="Billing" subtitle="Manage your plan">
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current plan</label>
                  <select value={settings.billing.plan} onChange={(e) => setSettings((prev) => ({ ...prev, billing: { ...prev.billing, plan: e.target.value } }))} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm">
                    {['Starter', 'Pro', 'Enterprise'].map((plan) => <option key={plan}>{plan}</option>)}
                  </select>
                </div>
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-sm text-white">Auto-renew subscription</span>
                  <input type="checkbox" checked={settings.billing.autoRenew} onChange={(e) => setSettings((prev) => ({ ...prev, billing: { ...prev.billing, autoRenew: e.target.checked } }))} />
                </label>
              </div>
            </GlassCard>
          )}

          <div className="flex justify-end gap-4">
            {savedAt && <p className="text-xs text-slate-500 self-center mr-auto">Last saved: {savedAt}</p>}
            <button onClick={discardChanges} className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Discard Changes
            </button>
            <button onClick={saveSettings} className="px-6 py-2.5 bg-electric-blue text-graphite-900 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
