import React from 'react';
import { motion } from 'motion/react';
import { Database, Filter, Binary, BrainCircuit, CheckCircle2, ChevronRight, Code2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const steps = [
  {
    icon: Filter,
    title: "Text Preprocessing",
    description: "Cleaning noise from the signal. Removing URLs, @mentions, stopwords, and punctuation.",
    code: `def clean_text(text):
    text = text.lower()
    text = re.sub(r'http\\S+|@\\w+', '', text)
    return text`,
    details: ["Lowercasing", "Stopword Removal", "Regex Cleaning"]
  },
  {
    icon: Binary,
    title: "Feature Extraction (TF-IDF)",
    description: "Converting text into a numeric matrix based on word importance across the dataset.",
    code: `vectorizer = TfidfVectorizer(
    max_features=8000, 
    ngram_range=(1, 2))`,
    details: ["Term Frequency", "Inverse Document Freq", "Bigrams/Trigrams"]
  },
  {
    icon: BrainCircuit,
    title: "Logistic Regression",
    description: "A supervised classifier that predicts the probability of positive, negative, or neutral labels.",
    code: `model = LogisticRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)`,
    details: ["Calibration", "Sigmoid Function", "Hyperparameter Tuning"]
  }
];

export default function MLPipeline() {
  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-display font-medium tracking-tight">Traditional ML Pipeline</h2>
        <p className="text-[#71717A] text-sm font-mono uppercase tracking-wider italic">Deep dive into Classic Supervised Text Classification</p>
      </div>

      <div className="grid grid-cols-1 gap-6 relative">
        {/* Connection Line */}
        <div className="absolute left-[31px] top-12 bottom-12 w-px bg-gradient-to-b from-emerald-500/20 via-emerald-500/50 to-emerald-500/20 hidden lg:block" />

        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="tech-card grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 group"
          >
            <div className="lg:col-span-1 flex justify-center z-10">
              <div className="w-16 h-16 bg-[#18181B] tech-border rounded-none flex items-center justify-center p-4">
                <step.icon className="w-full h-full text-emerald-500 group-hover:scale-110 transition-transform" />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-[#3F3F46]">0{idx + 1}</span>
                <h3 className="text-lg font-display font-bold uppercase tracking-tight">{step.title}</h3>
              </div>
              <p className="text-sm text-[#71717A] leading-relaxed">{step.description}</p>
              <div className="flex flex-wrap gap-2">
                {step.details.map((detail, i) => (
                  <span key={i} className="text-[9px] font-mono px-2 py-0.5 bg-[#18181B] tech-border text-[#A1A1AA] uppercase">
                    {detail}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-black/40 p-4 tech-border">
              <div className="flex items-center justify-between mb-3 border-b border-[#27272A] pb-2">
                <span className="text-[10px] font-mono text-[#3F3F46] flex items-center gap-2">
                  <Code2 className="w-3 h-3" /> logic.py
                </span>
                <span className="text-[9px] font-mono text-emerald-500/50">PYTHON_ENV</span>
              </div>
              <pre className="text-xs font-mono text-[#D4D4D8] overflow-x-auto whitespace-pre-wrap">
                <code>{step.code}</code>
              </pre>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="tech-card p-10 bg-gradient-to-br from-[#09090B] to-[#10B981]/5 border-emerald-500/20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <Database className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-2xl font-display font-medium">Why This Matters for Interviews</h3>
          <p className="text-sm text-[#71717A] leading-relaxed italic">
            "While Gemini provides state-of-the-art results, understanding the TF-IDF pipeline is crucial for explaining basic ML concepts to recruiters. It demonstrates knowledge of vector spaces, feature engineering, and binary classification metrics."
          </p>
          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-white">79%</p>
              <p className="text-[10px] font-mono text-[#3F3F46] uppercase">Avg Accuracy (LogReg)</p>
            </div>
             <div className="text-center">
              <p className="text-2xl font-display font-bold text-emerald-500">94%</p>
              <p className="text-[10px] font-mono text-[#3F3F46] uppercase">Avg Accuracy (Gemini)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
