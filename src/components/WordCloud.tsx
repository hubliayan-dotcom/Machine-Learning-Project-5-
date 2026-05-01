import React from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface WordCloudProps {
  texts: string[];
  limit?: number;
}

export default function WordCloud({ texts, limit = 20 }: WordCloudProps) {
  const wordFreq = React.useMemo(() => {
    const freq: Record<string, number> = {};
    const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'to', 'for', 'and', 'my', 'of', 'in', 'it', 'I', 'this', 'was', 'with', 'you']);
    
    texts.forEach(text => {
      const words = text.toLowerCase().split(/\W+/);
      words.forEach(word => {
        if (word.length > 3 && !stopWords.has(word)) {
          freq[word] = (freq[word] || 0) + 1;
        }
      });
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }, [texts, limit]);

  if (wordFreq.length === 0) return null;

  const max = wordFreq[0][1];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-6">
      {wordFreq.map(([word, count], i) => {
        const size = 0.75 + (count / max) * 1.5;
        const opacity = 0.4 + (count / max) * 0.6;
        
        return (
          <motion.span
            key={word}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            style={{ fontSize: `${size}rem` }}
            className={cn(
              "font-mono uppercase tracking-tighter hover:text-emerald-500 transition-colors cursor-default select-none",
              count === max ? "text-white font-bold" : "text-[#71717A]"
            )}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}
