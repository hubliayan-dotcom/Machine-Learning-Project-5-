import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Upload, BarChart3, Settings, Shield, Github, Twitter, Info, Cpu } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'overview', icon: BarChart3, label: 'Analytics Hub' },
  { id: 'single', icon: Search, label: 'Single Analysis' },
  { id: 'batch', icon: Upload, label: 'Batch Processing' },
  { id: 'pipeline', icon: Cpu, label: 'ML Pipeline' },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 tech-border-r h-screen bg-[#09090B] flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-[#27272A]">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-6 h-6 text-emerald-500" />
          <span className="font-display font-bold text-lg tracking-tight">SENTIMENT.AI</span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#52525B] font-mono">v1.2.4-stable</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all group relative",
              activeTab === item.id 
                ? "text-white bg-[#18181B] tech-border" 
                : "text-[#71717A] hover:text-white hover:bg-[#18181B]/50"
            )}
          >
            {activeTab === item.id && (
              <motion.div
                layoutId="active-nav"
                className="absolute left-0 w-1 h-1/2 bg-emerald-500"
              />
            )}
            <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-emerald-500" : "text-current")} />
            <span className="font-mono tracking-wide uppercase text-[11px]">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#27272A] mt-auto space-y-4">
        <div className="bg-[#18181B] p-3 tech-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-tighter">System Status</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[10px] font-mono text-[#A1A1AA]">Gemini-3-Flash: Active</p>
        </div>
        
        <div className="flex items-center justify-between px-2">
          <button className="text-[#71717A] hover:text-white transition-colors"><Github className="w-4 h-4" /></button>
          <button className="text-[#71717A] hover:text-white transition-colors"><Twitter className="w-4 h-4" /></button>
          <button className="text-[#71717A] hover:text-white transition-colors"><Info className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
