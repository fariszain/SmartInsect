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

/* Animated counter for probability values */
function AnimCounter({ target, delay = 0 }: { target: number; delay?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const dur = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        setVal(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return <>{val.toFixed(1)}%</>;
}

const barColors = [
  'bg-gradient-to-r from-violet-500 to-purple-400',
  'bg-gradient-to-r from-sky-500 to-cyan-400',
  'bg-gradient-to-r from-amber-500 to-yellow-400',
];

const medals = ['🥇', '🥈', '🥉'];

export default function ResultCard({ result }: ResultProps) {
  const [showInsight, setShowInsight] = useState(false);
  const name = result.top_prediction.replace(/_/g, ' ');

  useEffect(() => {
    const t = setTimeout(() => setShowInsight(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="card p-6 md:p-8 space-y-10 relative overflow-hidden">

      {/* Corner glow decoration */}
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-violet-500/[0.06] blur-3xl pointer-events-none" />

      {/* ── Classification Result ── */}
      <div className="space-y-8 anim-fade-up">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-violet-300 tracking-widest uppercase">Klasifikasi Berhasil</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold capitalize tracking-tight text-white leading-tight">
            {name}
          </h2>
        </div>

        {/* Probability Bars */}
        <div className="space-y-5">
          <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.15em] flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            Probabilitas Top-3
          </h3>

          <div className="space-y-4">
            {result.predictions.map((p, idx) => {
              const prob = p.prob * 100;
              const isTop = idx === 0;
              return (
                <div key={idx} className="group cursor-default space-y-2 anim-fade-up" style={{ animationDelay: `${200 + idx * 120}ms` }}>
                  <div className="flex items-baseline justify-between">
                    <span className={`text-sm capitalize font-medium flex items-center gap-2 transition-colors duration-300 ${isTop ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                      <span className="text-base group-hover:scale-125 transition-transform duration-300 inline-block">{medals[idx]}</span>
                      {p.class.replace(/_/g, ' ')}
                    </span>
                    <span className={`font-mono text-sm font-bold tabular-nums ${isTop ? 'text-violet-400' : 'text-zinc-600 group-hover:text-zinc-400'} transition-colors duration-300`}>
                      <AnimCounter target={prob} delay={300 + idx * 150} />
                    </span>
                  </div>
                  <div className="prob-bar-track group-hover:bg-white/[0.06] transition-colors duration-300">
                    <div
                      className={`prob-bar-fill ${barColors[idx]}`}
                      style={{ width: `${prob}%`, animationDelay: `${400 + idx * 200}ms` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* ── AI Insights ── */}
      <div className={`space-y-5 transition-all duration-700 ${showInsight ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-500/20 border border-violet-500/10 flex items-center justify-center group cursor-default hover:scale-110 transition-transform duration-300">
            <svg className="w-5 h-5 text-violet-400 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">AI Species Insights</h3>
            <p className="text-[10px] text-zinc-600 font-mono">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>

        <div className="bg-[#0e0e16] border border-white/[0.04] rounded-2xl p-6 hover:border-violet-500/10 transition-colors duration-500">
          <div className="prose-styled max-w-none text-sm">
            <ReactMarkdown>{result.ai_insight}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}