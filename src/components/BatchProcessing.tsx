import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { analyzeBatchSentiment, type SentimentResult } from '@/src/services/geminiService';
import { Upload, FileSpreadsheet, Download, Loader2, CheckCircle2, ChevronRight, Table } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

import WordCloud from './WordCloud';

interface AnalyzedRow {
  text: string;
  sentiment: string;
  confidence: number;
}

export default function BatchProcessing() {
  const [data, setData] = useState<any[]>([]);
  const [results, setResults] = useState<AnalyzedRow[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setData([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setError("The file appears to be empty.");
          return;
        }

        // Detect text column (case-insensitive)
        const firstRow = results.data[0] as any;
        const keys = Object.keys(firstRow);
        const textKey = keys.find(k => k.toLowerCase().trim() === 'text');

        if (!textKey) {
          setError("Required column 'text' not found. Please ensure your CSV has a header named 'text'.");
          return;
        }

        const cleanedData = results.data
          .filter((row: any) => row[textKey] && row[textKey].toString().trim().length > 0)
          .map((row: any) => ({
            ...row,
            text: row[textKey] // Normalize the key name to 'text' internally
          }));

        if (cleanedData.length === 0) {
          setError("No valid text found in the identified column.");
          return;
        }

        setData(cleanedData);
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
      }
    });
  };

  const runBatchAnalysis = async () => {
    if (data.length === 0) return;
    setProcessing(true);
    setResults([]);
    
    // Batch size of 10 for API safety/performance
    const batchSize = 10;
    const finalResults: AnalyzedRow[] = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize).map(r => r.text);
      try {
        const batchResults = await analyzeBatchSentiment(batch);
        const mappedResults = batchResults.map((res, index) => ({
          text: batch[index],
          sentiment: res.sentiment,
          confidence: res.confidence,
        }));
        finalResults.push(...mappedResults);
        setProgress(Math.min(100, Math.round(((i + batchSize) / data.length) * 100)));
      } catch (err) {
        console.error("Batch error at index", i, err);
      }
    }
    
    setResults(finalResults);
    setProcessing(false);
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(results);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentiment_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-display font-medium tracking-tight">Mass Ingestion Pipeline</h2>
        <p className="text-[#71717A] text-sm font-mono uppercase tracking-wider italic">Contextual batch sentiment analysis via CSV processing</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Upload & Controls */}
        <div className="xl:col-span-1 space-y-6">
          <div className="tech-card p-6 space-y-6">
            <div className="border-b border-[#27272A] pb-4">
              <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest">Configuration</span>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed border-[#27272A] p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#52525B] hover:bg-[#18181B]/50 transition-all",
                data.length > 0 && "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/30"
              )}
            >
              <div className={cn(
                "p-4 rounded-full bg-[#18181B]",
                data.length > 0 && "bg-emerald-500/10 text-emerald-500"
              )}>
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-xs font-mono uppercase tracking-widest mb-1">
                  {data.length > 0 ? "File Loaded" : "Upload Dataset"}
                </p>
                <p className="text-[10px] text-[#71717A] font-light">CSV with 'text' column required</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".csv" 
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-[10px] font-mono bg-rose-500/10 p-3 tech-border">
                <Table className="w-3 h-3" />
                <span>{error}</span>
              </div>
            )}

            {data.length > 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between p-3 bg-[#18181B] tech-border">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-4 h-4 text-[#71717A]" />
                    <span className="text-[11px] font-mono uppercase">{data.length} Records</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shadow-sm" />
                </div>

                <button
                  onClick={runBatchAnalysis}
                  disabled={processing}
                  className="w-full tech-button py-4 flex items-center justify-center gap-3 bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-black"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing {progress}%</span>
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-4 h-4" />
                      <span>Execute Pipeline</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="tech-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
                <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest">Signal Cluster (Word Cloud)</span>
                <select 
                  className="bg-[#0A0A0B] text-[10px] font-mono text-[#71717A] outline-none border-none uppercase"
                  value={filterSentiment}
                  onChange={(e) => setFilterSentiment(e.target.value as any)}
                >
                  <option value="all">Global</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
              <WordCloud 
                texts={
                  filterSentiment === 'all' 
                    ? results.map(r => r.text) 
                    : results.filter(r => r.sentiment === filterSentiment).map(r => r.text)
                } 
              />
            </div>
          )}

          {results.length > 0 && !processing && (
            <button
              onClick={downloadCSV}
              className="w-full tech-button py-4 flex items-center justify-center gap-3 bg-white text-black hover:bg-[#E4E4E7]"
            >
              <Download className="w-4 h-4" />
              <span>Export Results</span>
            </button>
          )}
        </div>

        {/* Data Preview / Table */}
        <div className="xl:col-span-2">
          <div className="tech-card h-full min-h-[600px] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#27272A] bg-[#18181B] flex items-center justify-between shrink-0">
              <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest flex items-center gap-2">
                <Table className="w-3 h-3" /> Data Output Stream
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-mono uppercase text-[#71717A]">POS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-[9px] font-mono uppercase text-[#71717A]">NEG</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[9px] font-mono uppercase text-[#71717A]">NEU</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-[#0A0A0B] z-10">
                  <tr className="border-b border-[#27272A]">
                    <th className="p-4 text-left font-mono text-[10px] uppercase text-[#71717A] tracking-tighter w-16">ID</th>
                    <th className="p-4 text-left font-mono text-[10px] uppercase text-[#71717A] tracking-tighter">Content Signal</th>
                    <th className="p-4 text-left font-mono text-[10px] uppercase text-[#71717A] tracking-tighter w-32">Polarity</th>
                    <th className="p-4 text-left font-mono text-[10px] uppercase text-[#71717A] tracking-tighter w-24">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18181B]">
                  {results.length > 0 ? (
                    results.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#18181B]/30 transition-colors">
                        <td className="p-4 font-mono text-[10px] text-[#3F3F46]">{(idx + 1).toString().padStart(4, '0')}</td>
                        <td className="p-4 text-sm text-[#D4D4D8] line-clamp-2 max-w-md">{item.text}</td>
                        <td className="p-4">
                          <span className={cn(
                            "px-2 py-0.5 font-mono text-[9px] uppercase border",
                            item.sentiment === 'positive' && "text-emerald-500 border-emerald-500/20 bg-emerald-500/5",
                            item.sentiment === 'negative' && "text-rose-500 border-rose-500/20 bg-rose-500/5",
                            item.sentiment === 'neutral' && "text-amber-500 border-amber-500/20 bg-amber-500/5",
                          )}>
                            {item.sentiment}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[10px] text-[#A1A1AA]">
                          {(item.confidence * 100).toFixed(0)}%
                        </td>
                      </tr>
                    ))
                  ) : (
                    data.map((item, idx) => (
                      <tr key={idx} className="opacity-40">
                        <td className="p-4 font-mono text-[10px] text-[#3F3F46]">{(idx + 1).toString().padStart(4, '0')}</td>
                        <td className="p-4 text-sm text-[#71717A] line-clamp-1">{item.text}</td>
                        <td className="p-4 text-[10px] font-mono uppercase text-[#3F3F46]">QUEUED</td>
                        <td className="p-4 text-[10px] font-mono text-[#3F3F46]">--</td>
                      </tr>
                    ))
                  )}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-20 text-center text-[#3F3F46] font-mono text-[11px] uppercase tracking-widest italic">
                        Empty dataset buffer
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
