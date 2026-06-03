'use client';

import { useState } from 'react';
import ResultCard from '@/components/ResultCard';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null); // Reset hasil jika ganti gambar
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null); // Kosongkan hasil sebelumnya
    
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();

      // CEK STATUS RESPONSE
      if (!response.ok) {
        throw new Error(data.detail || "Terjadi kesalahan pada server");
      }
      
      setResult(data);
    } catch (error: any) {
      console.error("Gagal menganalisis gambar:", error);
      alert(error.message || "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 font-sans flex flex-col items-center py-12 px-4 relative overflow-hidden">
      
      {/* Background Ornamen Gradien Neon */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl w-full space-y-8 z-10 relative">
        
        {/* Header Dashboard Premium */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-neutral-800/80 pb-6 gap-6">
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Lens<span className="text-white">Arthropoda</span>
            </h1>
            <p className="text-neutral-400 text-sm md:text-base font-light">
              Identifikasi Spesies Serangga Cerdas & Wawasan AI Real-Time
            </p>
          </div>
          
          {/* Metadata Pil Sistem */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-4 py-2 bg-neutral-900/60 border border-neutral-800 rounded-xl backdrop-blur-md flex flex-col items-center min-w-[100px]">
              <span className="text-[10px] text-neutral-500 font-mono uppercase">Akurasi Uji</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">84.17%</span>
            </div>
            <div className="px-4 py-2 bg-neutral-900/60 border border-neutral-800 rounded-xl backdrop-blur-md flex flex-col items-center min-w-[100px]">
              <span className="text-[10px] text-neutral-500 font-mono uppercase">Total Kelas</span>
              <span className="text-sm font-bold text-teal-300 font-mono">118 Kelas</span>
            </div>
            <div className="px-4 py-2 bg-neutral-900/60 border border-neutral-800 rounded-xl backdrop-blur-md flex flex-col items-center min-w-[100px]">
              <span className="text-[10px] text-neutral-500 font-mono uppercase">Arsitektur</span>
              <span className="text-sm font-bold text-cyan-300 font-mono">EffNet-B3</span>
            </div>
          </div>
        </div>

        {/* Layout Grid 2-Kolom saat ada Hasil */}
        <div className={`grid grid-cols-1 ${result ? 'lg:grid-cols-12' : 'max-w-3xl mx-auto'} gap-8 transition-all duration-500`}>
          
          {/* Kolom Kontrol / Upload */}
          <div className={`${result ? 'lg:col-span-5' : 'w-full'} space-y-6`}>
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md flex flex-col gap-6 relative group hover:border-emerald-500/20 transition-all duration-300">
              
              <h2 className="text-base font-bold text-neutral-300 flex items-center gap-2 border-b border-neutral-800/60 pb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Input Citra Serangga
              </h2>

              <label 
                className={`flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden group ${preview ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' : 'border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800/40'}`}
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Preview" className="h-full w-full object-cover p-2 rounded-2xl transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    <div className="w-16 h-16 mb-4 bg-neutral-800/80 rounded-2xl flex items-center justify-center border border-neutral-700/80 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 transition-all duration-300">
                      <svg className="w-8 h-8 text-neutral-400 group-hover:text-emerald-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <p className="mb-2 text-sm text-neutral-300">
                      <span className="font-semibold text-emerald-400 group-hover:underline">Klik untuk mengunggah</span> atau seret citra
                    </p>
                    <p className="text-xs text-neutral-500">PNG, JPG, atau JPEG (Maks. 5MB)</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>

              <button 
                onClick={analyzeImage}
                disabled={!image || loading}
                className="w-full py-4 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-neutral-800 disabled:to-neutral-850 disabled:text-neutral-500 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-400/20 disabled:shadow-none transition-all duration-300 flex justify-center items-center gap-2 transform active:scale-98"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Menganalisis...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <span>Analisis Serangga</span>
                  </div>
                )}
              </button>
            </div>
            
            {/* Riwayat / Tips Kecil */}
            <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-5 backdrop-blur-md">
              <h3 className="text-xs font-bold text-neutral-400 tracking-wider uppercase mb-2">Panduan Pengujian</h3>
              <ul className="text-xs text-neutral-500 space-y-2 list-disc list-inside">
                <li>Gunakan foto makro dengan pencahayaan yang jelas untuk hasil terbaik.</li>
                <li>Fokus pada bagian tubuh serangga secara detail.</li>
                <li>Data diolah secara lokal dengan teknologi model TorchScript.</li>
              </ul>
            </div>
          </div>

          {/* Kolom Hasil Prediksi */}
          {result && (
            <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-8 duration-500">
              <ResultCard result={result} />
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-neutral-900/60 text-neutral-600 text-xs font-mono">
          <p>© 2026 LensArthropoda | Final Project Pembelajaran Mesin</p>
        </div>

      </div>
    </main>
  );
}