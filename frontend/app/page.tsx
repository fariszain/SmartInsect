'use client';

import { useState, useRef, useCallback } from 'react';
import ResultCard from '@/components/ResultCard';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('file', image);
    try {
      const res = await fetch('http://localhost:8000/analyze', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Server error');
      setResult(data);
    } catch (err: any) {
      alert(err.message || 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setImage(null); setPreview(null); setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <main className="min-h-screen relative" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.08), transparent), #0b0b0f' }}>

      {/* ━━━ Navbar ━━━ */}
      <nav className="anim-fade-down sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/[0.04] bg-[#0b0b0f]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group cursor-pointer hover:scale-110 transition-transform duration-300">
            <svg className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">
            Lens<span className="text-violet-400">Arthropoda</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-5 text-xs text-zinc-500 font-mono">
          <span className="hover:text-violet-400 transition-colors cursor-default">ACC 84.17%</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span className="hover:text-violet-400 transition-colors cursor-default">118 Classes</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span className="hover:text-violet-400 transition-colors cursor-default">EfficientNet-B3</span>
        </div>
      </nav>

      {/* ━━━ Hero Section ━━━ */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-6">
        <div className="text-center space-y-4 anim-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-300 text-xs font-medium anim-scale-in delay-200">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Final Project Machine Learning 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Identifikasi Serangga
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-400 anim-gradient">
              dengan Kecerdasan AI
            </span>
          </h1>
          <p className="text-zinc-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed anim-fade-up delay-300">
            Unggah foto serangga dan dapatkan klasifikasi instan dari model Deep Learning
            serta wawasan ensiklopedis dari Gemini AI — semua dalam hitungan detik.
          </p>
        </div>
      </section>

      {/* ━━━ Main Content ━━━ */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
        <div className={`grid gap-8 transition-all duration-700 ${result ? 'grid-cols-1 lg:grid-cols-5' : 'max-w-2xl mx-auto'}`}>

          {/* ── Upload Card ── */}
          <div className={`${result ? 'lg:col-span-2' : ''} space-y-5 anim-fade-up delay-400`}>
            <div className="card p-6 space-y-5">

              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  Upload Citra
                </h2>
                {preview && (
                  <button onClick={resetState} className="text-xs text-zinc-600 hover:text-rose-400 transition-colors font-mono flex items-center gap-1 group">
                    <svg className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reset
                  </button>
                )}
              </div>

              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`dropzone ${isDragging ? 'active' : ''} relative flex flex-col items-center justify-center w-full min-h-[280px] overflow-hidden`}
              >
                {preview ? (
                  <div className="absolute inset-0 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-[18px] transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-[18px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
                      <span className="text-xs text-white/90 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">Klik untuk ganti gambar</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center py-8 px-6 relative z-10">
                    <div className="icon-box w-14 h-14 rounded-2xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-center mb-5">
                      <svg className="icon-svg w-7 h-7 text-zinc-600 transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <p className="text-sm text-zinc-400 mb-1">
                      <span className="text-violet-400 font-medium cursor-pointer hover:underline">Klik untuk unggah</span> atau seret gambar
                    </p>
                    <p className="text-[11px] text-zinc-600">PNG, JPG, JPEG • Maks 5MB</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeImage}
                disabled={!image || loading}
                className="btn-primary w-full py-4 text-sm tracking-wide flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="loading-dot" />
                      <div className="loading-dot" />
                      <div className="loading-dot" />
                    </div>
                    <span>Menganalisis...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                    Analisis Serangga
                  </div>
                )}
              </button>
            </div>

            {/* Tips Card */}
            <div className="card p-5 space-y-3 anim-fade-up delay-500">
              <h3 className="text-[11px] font-bold text-zinc-500 tracking-widest uppercase">Tips Penggunaan</h3>
              <div className="space-y-3">
                {[
                  { icon: '📷', text: 'Gunakan foto makro dengan pencahayaan yang jelas.' },
                  { icon: '🔍', text: 'Fokus pada tubuh serangga secara penuh dan detail.' },
                  { icon: '⚡', text: 'Inferensi dilakukan secara lokal via PyTorch TorchScript.' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 group cursor-default">
                    <span className="text-sm group-hover:scale-125 transition-transform duration-300">{tip.icon}</span>
                    <p className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300 leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Results Panel ── */}
          {result && (
            <div className="lg:col-span-3 anim-fade-right delay-200">
              <ResultCard result={result} />
            </div>
          )}
        </div>
      </section>

      {/* ━━━ Footer ━━━ */}
      <footer className="border-t border-white/[0.04] py-6 text-center anim-fade-up delay-700">
        <p className="text-[11px] text-zinc-700 font-mono tracking-wider">
          © 2026 LENSARTHROPODA — FINAL PROJECT PEMBELAJARAN MESIN
        </p>
      </footer>
    </main>
  );
}