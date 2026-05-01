/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import SingleAnalysis from './components/SingleAnalysis';
import BatchProcessing from './components/BatchProcessing';
import MLPipeline from './components/MLPipeline';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Cpu, Network } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <DashboardOverview />;
      case 'single': return <SingleAnalysis />;
      case 'batch': return <BatchProcessing />;
      case 'pipeline': return <MLPipeline />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] selection:bg-emerald-500 selection:text-black">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pl-64 min-h-screen">
        {/* Header Bar */}
        <header className="h-16 border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#71717A]" />
              <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest">Inference_Node_01</span>
            </div>
            <div className="h-4 w-px bg-[#27272A]" />
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#71717A]" />
              <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest">CPU: 4.2 GHz</span>
            </div>
            <div className="h-4 w-px bg-[#27272A]" />
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-500/50" />
              <span className="text-[10px] font-mono text-emerald-500/50 uppercase tracking-widest">Network Secure</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-mono text-white leading-none mb-1 uppercase">Cloud_Runtime_Active</p>
              <p className="text-[9px] font-mono text-[#71717A] uppercase tracking-tighter italic">ASIA-SOUTHEAST1-A</p>
            </div>
            <div className="w-8 h-8 rounded-none border border-[#27272A] bg-[#18181B] flex items-center justify-center p-1">
              <Shield className="w-full h-full text-emerald-500" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Grid Overlay for technical feel */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
    </div>
  );
}

