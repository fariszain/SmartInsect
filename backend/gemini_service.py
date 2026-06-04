import os
from google import genai
from google.genai import types

# Database fallback statis untuk serangga umum
FALLBACK_DATABASE = {
    "apis_mellifera": """
- Nama Ilmiah: *Apis mellifera*
- Nama Umum: Lebah Madu Barat (Western Honey Bee)
- Spesies: *Apis mellifera*
- Genus: *Apis*
- Famili: Apidae
- Habitat: Padang rumput, kebun buah, hutan, dan area pertanian di seluruh dunia.
- Fun Fact:
  1. Lebah madu berkomunikasi satu sama lain menggunakan "tarian goyang" (waggle dance) untuk memberi tahu arah dan jarak ke sumber bunga terbaik.
  2. Mereka adalah satu-satunya serangga yang menghasilkan makanan yang juga dikonsumsi oleh manusia (madu).
""",
    "lepidoptera": """
- Nama Ilmiah: Ordo Lepidoptera
- Nama Umum: Kupu-kupu dan Ngengat
- Spesies: Berbagai spesies kupu-kupu/ngengat
- Genus: Bervariasi
- Famili: Bervariasi (misalnya Nymphalidae, Papilionidae)
- Habitat: Hutan tropis, kebun, daerah pegunungan, hingga padang pasir.
- Fun Fact:
  1. Kupu-kupu mencicipi makanan mereka menggunakan sensor rasa yang terletak di kaki mereka.
  2. Sayap kupu-kupu sebenarnya transparan; warna-warni indah yang kita lihat berasal dari pantulan cahaya pada sisik mikroskopis yang menutupi sayap mereka.
""",
    "anopheles": """
- Nama Ilmiah: *Anopheles* spp.
- Nama Umum: Nyamuk Malaria
- Spesies: *Anopheles gambiae*, *Anopheles stephensi*, dll.
- Genus: *Anopheles*
- Famili: Culicidae
- Habitat: Genangan air bersih, rawa-rawa, sawah, dan daerah tropis hangat.
- Fun Fact:
  1. Hanya nyamuk betina yang menggigit manusia dan hewan karena mereka membutuhkan protein dari darah untuk perkembangan telur mereka.
  2. Nyamuk Anopheles biasanya aktif menggigit saat malam hari hingga menjelang subuh dan hinggap dengan sudut 45 derajat ketika hinggap di permukaan kulit.
"""
}

class GeminiExpert:
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("API Key Gemini tidak boleh kosong.")
        # Inisialisasi Google GenAI client
        self.client = genai.Client(api_key=api_key)

    def get_insect_info(self, insect_name: str, image_bytes: bytes = None, mime_type: str = "image/jpeg") -> str:
        # Normalisasi nama serangga (lowercase dan ganti spasi dengan underscore)
        clean_name = insect_name.lower().replace(" ", "_").strip()
        
        prompt = f"""
        Berdasarkan hasil klasifikasi model awal, serangga ini tergolong sebagai "{insect_name}".
        Tolong lihat gambar yang disertakan, lakukan identifikasi visual yang lebih spesifik, lalu berikan informasi detail dengan format yang rapi dan menarik:
        - Nama Ilmiah: (Sebutkan nama ilmiah paling spesifik yang bisa Anda identifikasi dari gambar. Jika berupa serangga umum seperti capung/belalang, coba identifikasi genus dan spesies spesifiknya berdasarkan penampakan fisiknya di foto)
        - Nama Umum:
        - Spesies: (Sebutkan nama spesies spesifik, misal Pantala flavescens untuk capung kembara, dll.)
        - Genus:
        - Famili:
        - Habitat:
        - Fun Fact: (Berikan 1 atau 2 fakta unik yang jarang diketahui)
        
        Berikan jawaban langsung tanpa basa-basi pengantar atau penutup. Gunakan bahasa Indonesia yang baik dan benar.
        """
        
        contents = []
        if image_bytes:
            contents.append(
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type
                )
            )
        contents.append(prompt)
        
        try:
            # Gunakan model gemini-2.5-flash untuk performa terbaik dengan ThinkingConfig dan Search Grounding
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=contents,
                config=types.GenerateContentConfig(
                    thinking_config=types.ThinkingConfig(thinking_budget=2048),
                    tools=[types.Tool(google_search=types.GoogleSearch())]
                )
            )
            
            # Jika respon berhasil diperoleh, kembalikan teksnya
            if response.text:
                return response.text.strip()
            else:
                raise ValueError("Respon teks dari Gemini kosong.")
                
        except Exception as e:
            error_msg = str(e)
            print(f"Error pada Gemini API: {error_msg}. Menggunakan fallback database...")
            
            # Cari di fallback database
            for key, val in FALLBACK_DATABASE.items():
                if key in clean_name or clean_name in key:
                    return f"{val}\n\n*(Catatan: Menampilkan database lokal offline karena Gemini API mengalami kendala: {error_msg})*"
            
            # Default fallback jika tidak ada di database lokal
            return f"""
- Nama Ilmiah: *{insect_name}* (Perlu Verifikasi)
- Nama Umum: {insect_name.replace('_', ' ').capitalize()}
- Spesies: Belum dapat ditentukan secara offline
- Genus: Belum dapat ditentukan secara offline
- Famili: Belum dapat ditentukan secara offline
- Habitat: Bervariasi di alam liar
- Fun Fact:
  1. Serangga ini memiliki peran penting dalam ekosistem lokal baik sebagai penyerbuk, dekomposer, maupun bagian dari rantai makanan.

*(Catatan: Detail informasi AI tidak termuat karena kendala koneksi server Gemini API: {error_msg})*
"""
