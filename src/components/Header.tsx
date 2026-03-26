import React from 'react';
import { Search, Bell, User, ChevronDown, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-20 glass-panel border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 transition-colors group-focus-within:text-electric-blue" />
          <input 
            type="text" 
            placeholder="Search anything... (Cmd + K)"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-electric-blue/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-electric-blue rounded-full border-2 border-graphite-900 shadow-[0_0_10px_rgba(0,242,255,0.5)]"></span>
        </button>

        <div className="h-8 w-px bg-white/10"></div>

        <div className="flex items-center gap-4 pl-2 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">Alex Rivera</p>
            <p className="text-[10px] text-electric-blue font-bold uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Pro Account
            </p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl border-2 border-white/10 p-0.5 group-hover:border-electric-blue/50 transition-colors">
              <img 
                src="https://picsum.photos/seed/alex/100/100" 
                alt="Profile" 
                className="w-full h-full rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
        </div>
      </div>
    </header>
  );
};
