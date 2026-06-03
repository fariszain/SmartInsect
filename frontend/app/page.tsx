'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ResultCard from '@/components/ResultCard';

/* ── Floating Particle Background ── */
function ParticleField() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `-10px`,
            background: i % 3 === 0 
              ? 'rgba(16,185,129,0.5)' 
              : i % 3 === 1 
                ? 'rgba(6,182,212,0.4)' 
                : 'rgba(99,102,241,0.3)',
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            animationDuration: `${12 + Math.random() * 18}s`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Stat Pill Component ── */
function StatPill({ label, value, color, delay }: { label: string; value: string; color: string; delay: string }) {
  return (
    <div className={`animate-slide-up ${delay} px-5 py-3 glass-card rounded-2xl flex flex-col items-center min-w-[110px] group hover:scale-105 transition-transform duration-300`}>
      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{label}</span>
      <span className={`text-sm font-bold font-mono ${color}`}>{value}</span>
    </div>
  );
}

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate upload progress animation
  useEffect(() => {
    if (loading) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) { clearInterval(interval); return 90; }
          return prev + Math.random() * 15;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      if (result) setUploadProgress(100);
    }
  }, [loading, result]);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon unggah file gambar (PNG, JPG, JPEG).');
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  /* ── Drag & Drop Handlers ── */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Terjadi kesalahan pada server");
      setResult(data);
    } catch (error: any) {
      console.error("Gagal menganalisis gambar:", error);
      alert(error.message || "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <main className="min-h-screen text-slate-200 font-sans flex flex-col items-center relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg, #040810 0%, #0a1628 30%, #071218 60%, #050d12 100%)' }}
    >
      <ParticleField />

      {/* ── Ambient Glow Orbs ── */}
      <div className="fixed top-[-20%] left-[-15%] w-[600px] h-[600px] rounded-full bg-emerald-600/[0.07] blur-[150px] pointer-events-none animate-pulse-glow" />
      <div className="fixed bottom-[-20%] right-[-15%] w-[600px] h-[600px] rounded-full bg-cyan-600/[0.06] blur-[150px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <div className="fixed top-[40%] left-[60%] w-[400px] h-[400px] rounded-full bg-indigo-600/[0.04] blur-[120px] pointer-events-none animate-float" />

      {/* ── Main Content ── */}
      <div className="max-w-6xl w-full z-10 relative px-4 sm:px-6 py-10 space-y-8">

        {/* ══════ HEADER ══════ */}
        <header className="animate-slide-up flex flex-col md:flex-row justify-between items-center pb-8 gap-6 border-b border-white/[0.04]">
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              {/* Logo Icon */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-glow-ring">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Lens</span>
                <span className="text-white">Arthropoda</span>
              </h1>
            </div>
            <p className="text-slate-500 text-sm font-light pl-0 md:pl-14">
              Identifikasi Spesies Serangga Cerdas &amp; Wawasan AI Real-Time
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <StatPill label="Akurasi Uji" value="84.17%" color="text-emerald-400" delay="delay-100" />
            <StatPill label="Total Kelas" value="118 Kelas" color="text-teal-300" delay="delay-200" />
            <StatPill label="Arsitektur" value="EffNet-B3" color="text-cyan-300" delay="delay-300" />
          </div>
        </header>

        {/* ══════ MAIN GRID ══════ */}
        <div className={`grid grid-cols-1 ${result ? 'lg:grid-cols-12' : 'max-w-3xl mx-auto'} gap-8 transition-all duration-700`}>

          {/* ── LEFT: Upload Panel ── */}
          <div className={`${result ? 'lg:col-span-5' : 'w-full'} space-y-5 animate-slide-up delay-200`}>

            {/* Upload Card */}
            <div className="glass-card glass-card-hover rounded-3xl p-6 space-y-5 transition-all duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Input Citra Serangga
                </h2>
                {preview && (
                  <button
                    onClick={resetState}
                    className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors duration-200 font-mono flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reset
                  </button>
                )}
              </div>

              {/* ── DROPZONE ── */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden group
                  ${isDragging 
                    ? 'dropzone-active border-emerald-500/60' 
                    : preview 
                      ? 'border-emerald-500/30 bg-emerald-500/[0.03]' 
                      : 'border-slate-700/60 hover:border-slate-500/60 hover:bg-white/[0.02]'
                  }`}
              >
                {preview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center pb-4">
                      <span className="text-xs text-white/80 font-medium bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        Klik untuk ganti gambar
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                    <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center border transition-all duration-500
                      ${isDragging 
                        ? 'bg-emerald-500/20 border-emerald-500/50 scale-110' 
                        : 'bg-slate-800/60 border-slate-700/60 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10'
                      }`}
                    >
                      <svg className={`w-8 h-8 transition-all duration-500 ${isDragging ? 'text-emerald-400 scale-110' : 'text-slate-500 group-hover:text-emerald-400'}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="mb-1.5 text-sm text-slate-400">
                      <span className="font-semibold text-emerald-400 group-hover:underline">Klik untuk mengunggah</span>
                      {' '}atau seret gambar ke sini
                    </p>
                    <p className="text-[11px] text-slate-600">PNG, JPG, JPEG (Maks. 5MB)</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* ── Analyze Button ── */}
              <button
                onClick={analyzeImage}
                disabled={!image || loading}
                className="w-full py-4 px-4 rounded-2xl font-semibold text-sm transition-all duration-300 flex justify-center items-center gap-2.5 relative overflow-hidden group
                  disabled:bg-slate-800/80 disabled:text-slate-600 disabled:cursor-not-allowed disabled:shadow-none
                  enabled:bg-gradient-to-r enabled:from-emerald-600 enabled:to-teal-600 enabled:text-white enabled:shadow-lg enabled:shadow-emerald-500/15
                  enabled:hover:from-emerald-500 enabled:hover:to-teal-500 enabled:hover:shadow-emerald-500/25 enabled:hover:scale-[1.01]
                  enabled:active:scale-[0.98]"
              >
                {/* Shimmer effect on enabled button */}
                {image && !loading && (
                  <div className="absolute inset-0 animate-shimmer pointer-events-none" />
                )}
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="relative w-5 h-5">
                      <div className="absolute inset-0 border-2 border-white/20 rounded-full" />
                      <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin" />
                    </div>
                    <span>Menganalisis citra...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Analisis Serangga</span>
                  </div>
                )}
              </button>

              {/* Progress Bar */}
              {loading && (
                <div className="space-y-1.5 animate-fade-in">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Memproses...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── Info Card ── */}
            <div className="glass-card rounded-2xl p-5 space-y-3 animate-slide-up delay-400">
              <h3 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Panduan Pengujian
              </h3>
              <ul className="text-[12px] text-slate-500 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">●</span>
                  Gunakan foto makro dengan pencahayaan yang jelas untuk hasil terbaik.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-0.5">●</span>
                  Fokus pada bagian tubuh serangga secara detail dan terisi penuh.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-0.5">●</span>
                  Data diolah secara lokal menggunakan model PyTorch TorchScript.
                </li>
              </ul>
            </div>
          </div>

          {/* ── RIGHT: Result Panel ── */}
          {result && (
            <div className="lg:col-span-7 animate-slide-in-right">
              <ResultCard result={result} />
            </div>
          )}
        </div>

        {/* ══════ FOOTER ══════ */}
        <footer className="text-center py-8 border-t border-white/[0.04] animate-fade-in delay-500">
          <p className="text-slate-600 text-xs font-mono">
            © 2026 LensArthropoda — Final Project Pembelajaran Mesin
          </p>
        </footer>
      </div>
    </main>
  );
}