import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  MessageSquareCode, 
  BarChart3, 
  Settings,
  Zap,
  LogOut
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: Kanban, label: 'Pipeline', path: '/pipeline' },
  { icon: MessageSquareCode, label: 'AI Assistant', path: '/ai' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen glass-panel border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.3)]">
          <Zap className="text-white w-6 h-6 fill-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tighter">
          NeuroCRM
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
              isActive 
                ? "bg-electric-blue/10 text-electric-blue border border-electric-blue/20 shadow-[0_0_15px_rgba(0,242,255,0.1)]" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            {item.path === '/ai' && (
              <span className="ml-auto text-[10px] bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded-full border border-neon-purple/30 font-bold uppercase tracking-wider">
                Beta
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5 space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) => cn(
            "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300",
            isActive 
              ? "bg-white/10 text-white" 
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </NavLink>
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
