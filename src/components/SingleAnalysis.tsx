import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeSentiment, type SentimentResult } from '@/src/services/geminiService';
import { Sparkles, Loader2, AlertCircle, TrendingUp, TrendingDown, Minus, Quote, Info } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function SingleAnalysis() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeSentiment(text);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const sentimentConfigs = {
    positive: { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    negative: { icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    neutral: { icon: Minus, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-display font-medium tracking-tight">Isolated Inference</h2>
        <p className="text-[#71717A] text-sm font-mono uppercase tracking-wider italic">Real-time linguistic evaluation engine</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="tech-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-4 mb-4">
              <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest flex items-center gap-2">
                <Quote className="w-3 h-3" /> Input Buffer
              </span>
              <span className="text-[10px] font-mono text-[#3F3F46]">{text.length}/1000 CHR</span>
            </div>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste social media text, review, or tweet here..."
              className="w-full h-48 tech-input resize-none"
            />

            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className={cn(
                "w-full tech-button py-4 flex items-center justify-center gap-3 group",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 group-hover:text-emerald-500 transition-colors" />
              )}
              <span>Analyze Signal</span>
            </button>
            
            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-xs font-mono bg-rose-500/10 p-3 tech-border">
                <AlertCircle className="w-4 h-4" />
                <span>ERR: {error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Result Section */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="tech-card h-full"
              >
                <div className="p-6 border-b border-[#27272A] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest">Analysis Result</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#71717A]">CONFIDENCE</span>
                    <span className="font-mono text-emerald-500">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <div className="p-8 flex flex-col items-center text-center space-y-6">
                  {(() => {
                    const Config = sentimentConfigs[result.sentiment];
                    return (
                      <>
                        <div className={cn("p-6 rounded-full border mb-2", Config.bg, Config.border)}>
                          <Config.icon className={cn("w-12 h-12", Config.color)} />
                        </div>
                        <div className="space-y-1">
                          <h3 className={cn("text-3xl font-display font-bold uppercase tracking-tighter", Config.color)}>
                            {result.sentiment}
                          </h3>
                          <p className="text-xs font-mono text-[#71717A] italic">POLARITY DETECTED</p>
                        </div>
                        
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#27272A] to-transparent" />
                        
                        <p className="text-sm text-[#D4D4D8] leading-relaxed max-w-sm">
                          {result.explanation}
                        </p>

                        <div className="w-full space-y-3">
                          <p className="text-[10px] font-mono text-[#71717A] text-left uppercase tracking-widest">Key Signal Phrases</p>
                          <div className="flex flex-wrap gap-2">
                            {result.key_phrases.map((phrase, i) => (
                              <span key={i} className="text-[10px] font-mono px-2 py-1 bg-[#18181B] tech-border text-[#A1A1AA]">
                                {phrase}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            ) : (
              <div className="tech-card h-full flex flex-col items-center justify-center p-12 text-center border-dashed opacity-50">
                <div className="w-16 h-16 rounded-full border border-dashed border-[#3F3F46] flex items-center justify-center mb-6">
                  <Info className="w-6 h-6 text-[#3F3F46]" />
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#71717A]">Awaiting Input Signal</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
