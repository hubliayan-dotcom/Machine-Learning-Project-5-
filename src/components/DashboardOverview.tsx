import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Clock, Activity, MessageSquare, Target, Info } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

// Mock data to show something on initial load
const MOCK_STATS = [
  { sentiment: 'positive', count: 452, color: '#10B981' },
  { sentiment: 'neutral', count: 284, color: '#F59E0B' },
  { sentiment: 'negative', count: 124, color: '#EF4444' },
];

const TIME_SERIES = [
  { time: '00:00', pos: 40, neu: 24, neg: 10 },
  { time: '04:00', pos: 30, neu: 13, neg: 22 },
  { time: '08:00', pos: 20, neu: 35, neg: 15 },
  { time: '12:00', pos: 55, neu: 25, neg: 8 },
  { time: '16:00', pos: 18, neu: 48, neg: 21 },
  { time: '20:00', pos: 46, neu: 22, neg: 12 },
];

export default function DashboardOverview() {
  const stats = [
    { label: 'Total Scanned', value: '14,641', icon: MessageSquare, change: '+12%', sub: 'vs last 24h' },
    { label: 'Avg Confidence', value: '89.4%', icon: Target, change: '+2.4%', sub: 'system integrity' },
    { label: 'Network Polarity', value: '+42', icon: Activity, change: '-4', sub: 'index score' },
    { label: 'Latency', value: '1.2s', icon: Clock, change: '-100ms', sub: 'inferencing speed' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-display font-medium tracking-tight">Intelligence Repository</h2>
        <p className="text-[#71717A] text-sm font-mono uppercase tracking-wider italic">Aggregate telemetry and predictive sentiment distribution</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="tech-card p-6 flex flex-col justify-between group hover:bg-[#18181B]/50 transition-colors">
            <div className="flex items-center justify-between mb-8">
              <div className="p-2 bg-[#18181B] tech-border">
                <stat.icon className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-[10px] font-mono text-[#71717A] font-bold group-hover:text-emerald-500 transition-colors">{stat.label}</span>
            </div>
            <div>
              <p className="text-3xl font-display font-bold tracking-tighter mb-1">{stat.value}</p>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className={stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}>{stat.change}</span>
                <span className="text-[#3F3F46] uppercase">{stat.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribution Chart */}
        <div className="tech-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8 border-b border-[#27272A] pb-4">
            <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> Sentiment Spread
            </span>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> POS</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> NEU</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500" /> NEG</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_STATS}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {MOCK_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} stroke="#000" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090B', border: '1px solid #27272A', borderRadius: '0', fontSize: '12px' }}
                  itemStyle={{ color: '#E4E4E7' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temporal Analysis */}
        <div className="tech-card p-6">
          <div className="flex items-center justify-between mb-8 border-b border-[#27272A] pb-4">
            <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-3 h-3" /> Temporal Polarity
            </span>
            <span className="text-[10px] font-mono text-[#3F3F46]">LIVE STREAM v8</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TIME_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181B" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#3F3F46" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  fontFamily="JetBrains Mono"
                />
                <YAxis 
                   stroke="#3F3F46" 
                   fontSize={10} 
                   tickLine={false} 
                   axisLine={false}
                   fontFamily="JetBrains Mono"
                />
                <Tooltip 
                  cursor={{ fill: '#18181B' }}
                  contentStyle={{ backgroundColor: '#09090B', border: '1px solid #27272A', borderRadius: '0', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                />
                <Bar dataKey="pos" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} barSize={20} />
                <Bar dataKey="neu" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} barSize={20} />
                <Bar dataKey="neg" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 tech-card p-6">
           <div className="flex items-center justify-between mb-6 border-b border-[#27272A] pb-4">
            <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest">Global Trend Markers</span>
          </div>
          <div className="space-y-4">
            {[
              { phrase: 'customer service', score: 88, sentiment: 'negative', drift: '+4%' },
              { phrase: 'flight delay', score: 72, sentiment: 'negative', drift: '+12%' },
              { phrase: 'baggage handling', score: 65, sentiment: 'neutral', drift: '-2%' },
              { phrase: 'new upgrade', score: 94, sentiment: 'positive', drift: '+24%' },
            ].map((trend, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#18181B]/30 tech-border">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-[#3F3F46]">#{i + 1}</span>
                  <span className="text-xs font-medium uppercase tracking-tight">{trend.phrase}</span>
                </div>
                <div className="flex items-center gap-6">
                   <div className="w-32 h-1.5 bg-[#09090B] tech-border">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${trend.score}%` }}
                      className={cn(
                        "h-full", 
                        trend.sentiment === 'positive' ? 'bg-emerald-500' : trend.sentiment === 'negative' ? 'bg-rose-500' : 'bg-amber-500'
                      )}
                    />
                  </div>
                  <span className="text-[10px] font-mono w-12 text-right">{trend.drift}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tech-card p-6 flex flex-col justify-center items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Info className="w-32 h-32" />
          </div>
          <div className="text-center space-y-4 relative z-10">
            <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.3em]">System Intelligence</p>
            <h3 className="text-xl font-display font-medium max-w-[200px] mx-auto">Predictive Modeling Active</h3>
            <p className="text-sm text-[#71717A] max-w-[240px] leading-relaxed italic">
              "Airline performance trending downwards in Pacific sectors. Recommend immediate customer engagement protocols."
            </p>
            <button className="tech-button">View Full Rpt</button>
          </div>
        </div>
      </div>
    </div>
  );
}
