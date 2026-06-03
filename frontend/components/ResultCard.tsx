import ReactMarkdown from 'react-markdown';

interface ResultProps {
  result: {
    top_prediction: string;
    predictions: { class: string; prob: number }[];
    ai_insight: string;
  };
}

export default function ResultCard({ result }: ResultProps) {
  // Format teks nama kelas serangga dengan merapikan underscore menjadi spasi
  const formattedTopPrediction = result.top_prediction.replace(/_/g, ' ');

  return (
    <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md space-y-8 relative overflow-hidden">
      
      {/* Ornamen Kilau Pojok Kanan Atas */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Bagian 1: Hasil Klasifikasi Model PyTorch */}
      <div className="space-y-6 pb-6 border-b border-neutral-800/80">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Hasil Klasifikasi Model ML
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white capitalize mt-3 tracking-tight">
            {formattedTopPrediction}
          </h2>
        </div>

        {/* Progress Bar Dinamis untuk Prediksi Top-3 */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-wider">
            Probabilitas Prediksi Teratas
          </h3>
          <div className="space-y-3">
            {result.predictions.map((p, idx) => {
              const probabilityPercent = p.prob * 100;
              const formattedProb = probabilityPercent.toFixed(1);
              
              // Tentukan warna bar: peringkat 1 lebih menyala dibanding peringkat 2 & 3
              const barGradientClass = idx === 0 
                ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                : "bg-gradient-to-r from-neutral-700 to-neutral-600";
                
              const labelColorClass = idx === 0 ? "text-emerald-300 font-bold" : "text-neutral-400";
              const percentColorClass = idx === 0 ? "text-emerald-400 font-bold" : "text-neutral-500";

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className={`capitalize ${labelColorClass}`}>{p.class.replace(/_/g, ' ')}</span>
                    <span className={percentColorClass}>{formattedProb}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-neutral-850 rounded-full overflow-hidden border border-neutral-800/50">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${barGradientClass}`}
                      style={{ width: `${probabilityPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bagian 2: Wawasan AI Spesies Serangga (Gemini Insights) */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            AI Species Insights (Gemini Explorer)
          </h3>
        </div>

        {/* Panel Teks Markdown Terformat */}
        <div className="bg-neutral-950/40 border border-neutral-800/60 rounded-2xl p-6 shadow-inner backdrop-blur-sm">
          <div className="prose prose-invert prose-emerald max-w-none text-sm text-neutral-300 leading-relaxed font-light whitespace-pre-wrap">
            <ReactMarkdown>
              {result.ai_insight}  
            </ReactMarkdown>  
          </div>
        </div>
      </div>
      
    </div>
  );
}