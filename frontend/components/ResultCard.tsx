'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ResultProps {
  result: {
    top_prediction: string;
    predictions: { class: string; prob: number }[];
    ai_insight: string;
  };
}

/* ── Animated Counter ── */
function AnimatedPercent({ target, delay = 0 }: { target: number; delay?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1200;
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setValue(eased * target);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, delay]);
  return <>{value.toFixed(1)}%</>;
}

/* ── Bar Color Configuration ── */
const barStyles = [
  { gradient: 'from-emerald-500 via-teal-400 to-cyan-400', text: 'text-emerald-300', percent: 'text-emerald-400', shadow: 'shadow-emerald-500/20' },
  { gradient: 'from-indigo-500 to-purple-400', text: 'text-indigo-300', percent: 'text-indigo-400', shadow: 'shadow-indigo-500/10' },
  { gradient: 'from-amber-500 to-orange-400', text: 'text-amber-300', percent: 'text-amber-400', shadow: 'shadow-amber-500/10' },
];

export default function ResultCard({ result }: ResultProps) {
  const [showInsight, setShowInsight] = useState(false);
  const formattedTopPrediction = result.top_prediction.replace(/_/g, ' ');

  useEffect(() => {
    const timer = setTimeout(() => setShowInsight(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="glass-card rounded-3xl overflow-hidden relative">

      {/* ── Decorative Corner Glow ── */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/[0.08] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/[0.06] rounded-full blur-3xl pointer-events-none" />

      {/* ══════ Section 1: Classification Results ══════ */}
      <div className="p-8 space-y-6 border-b border-white/[0.04]">

        {/* Badge + Title */}
        <div className="animate-slide-up space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.15em] text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Hasil Klasifikasi
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white capitalize tracking-tight leading-tight">
            {formattedTopPrediction}
          </h2>
        </div>

        {/* ── Probability Bars ── */}
        <div className="space-y-4 animate-slide-up delay-200">
          <h3 className="text-[11px] font-bold text-slate-500 font-mono uppercase tracking-widest flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Probabilitas Top-3
          </h3>

          <div className="space-y-3">
            {result.predictions.map((p, idx) => {
              const prob = p.prob * 100;
              const style = barStyles[idx] || barStyles[2];
              return (
                <div key={idx} className="space-y-1.5 group">
                  <div className="flex justify-between items-baseline text-xs font-mono">
                    <span className={`capitalize ${style.text} font-medium`}>
                      {idx === 0 && '🥇 '}
                      {idx === 1 && '🥈 '}
                      {idx === 2 && '🥉 '}
                      {p.class.replace(/_/g, ' ')}
                    </span>
                    <span className={`${style.percent} font-bold tabular-nums`}>
                      <AnimatedPercent target={prob} delay={idx * 200} />
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/[0.04]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${style.gradient} ${style.shadow} shadow-lg transition-all duration-1000 ease-out group-hover:brightness-125`}
                      style={{
                        width: `${prob}%`,
                        transitionDelay: `${idx * 150}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════ Section 2: AI Insights ══════ */}
      <div className={`p-8 space-y-5 transition-all duration-700 ${showInsight ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/20 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              AI Species Insights
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>

        {/* ── Markdown Panel ── */}
        <div className="bg-slate-950/40 border border-white/[0.04] rounded-2xl p-6 shadow-inner">
          <div className="prose-custom max-w-none text-sm leading-relaxed">
            <ReactMarkdown>
              {result.ai_insight}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}