from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ml_service import InsectClassifier
from gemini_service import GeminiExpert
import os
from dotenv import load_dotenv

# Memuat environment variable dari file .env
load_dotenv()

# Inisialisasi aplikasi FastAPI
app = FastAPI(
    title="LensArthropoda API",
    description="REST API untuk identifikasi spesies serangga dan wawasan AI",
    version="1.0.0"
)

# Konfigurasi CORS agar frontend Next.js dapat mengakses API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tentukan lokasi model dan metadata
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "artifacts", "model_scripted.pt")
METADATA_PATH = os.path.join(BASE_DIR, "artifacts", "model_metadata.json")

# Inisialisasi kebutuhan model klasifikasi
classifier = InsectClassifier(
    model_path=MODEL_PATH,
    metadata_path=METADATA_PATH
)

# Dapatkan API Key dari environment, fallback ke key yang diberikan user jika tidak ada
gemini_key = os.getenv("GEMINI_API_KEY", "AIzaSyA8fAZqcZzYrWnboErELqH1Q8jUUxHxo3I")
gemini_expert = GeminiExpert(api_key=gemini_key)

@app.get("/health")
async def health_check():
    """Endpoint untuk mengecek status backend, model, dan API Gemini."""
    model_loaded = classifier.model is not None
    model_file_exists = os.path.exists(MODEL_PATH)
    
    return {
        "status": "healthy" if (model_loaded or model_file_exists) else "warning",
        "model_file_exists": model_file_exists,
        "model_loaded": model_loaded,
        "gemini_api_configured": len(gemini_key) > 0
    }

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    # Validasi apakah file yang diunggah berupa gambar
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar")
    
    try:
        # Membaca file gambar
        image_bytes = await file.read()

        # Prediksi jenis serangga menggunakan model ML (mengembalikan top-3 prediksi)
        predictions = classifier.predict(image_bytes, top_k=3)
        
        if not predictions:
            raise HTTPException(status_code=500, detail="Model gagal menghasilkan prediksi")
            
        # Mengambil hasil prediksi terbaik
        top_prediction = predictions[0]["class"]
        
        # Mengambil informasi detail dari Gemini AI
        try:
            ai_insight = gemini_expert.get_insect_info(top_prediction, image_bytes, file.content_type)
        except Exception as gemini_error:
            print(f"Peringatan Gemini API: {gemini_error}")
            # Contoh template pesan ketika Gemini gagal memberikan response
            ai_insight = (
                f"Sistem lokal kami berhasil mengidentifikasi serangga ini sebagai **{top_prediction.replace('_', ' ').capitalize()}**.\n\n"
                "Namun, layanan AI Explorer (Gemini) saat ini sedang mengalami kendala atau rate limit dari server pusat Google.\n\n"
                "Silakan klik tombol analisis lagi dalam beberapa saat untuk memuat fakta unik dan detail famili serangga ini secara langsung."
            )
        
        # Mengembalikan hasil prediksi dan insight AI sesuai ekspektasi frontend Next.js
        return {
            "predictions": predictions,
            "top_prediction": top_prediction,
            "ai_insight": ai_insight
        }
        
    # Menangani error umum pada server
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Jalankan server FastAPI secara lokal pada port 8000
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
