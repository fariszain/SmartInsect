import json
import torch
import io
import os
from PIL import Image
import torchvision.transforms as transforms

class InsectClassifier:
    def __init__(self, model_path, metadata_path=None):
        self.model_path = model_path
        # Jika metadata_path tidak ditentukan, cari model_metadata.json di direktori yang sama
        if metadata_path is None:
            self.metadata_path = os.path.join(os.path.dirname(model_path), "model_metadata.json")
        else:
            self.metadata_path = metadata_path
            
        self.model = None
        self.class_names = None
        self.img_size = 300
        self.mean = [0.485, 0.456, 0.406]
        self.std = [0.229, 0.224, 0.225]
        self.transform = None
        
        # Coba muat metadata terlebih dahulu jika ada
        self._load_metadata()

    def _load_metadata(self):
        if os.path.exists(self.metadata_path):
            try:
                with open(self.metadata_path, 'r') as f:
                    meta = json.load(f)
                self.class_names = meta.get("class_names")
                self.img_size = meta.get("img_size", 300)
                # Dukung kedua format key metadata (baru: mean/std, lama: imagenet_mean/imagenet_std)
                self.mean = meta.get("mean", meta.get("imagenet_mean", [0.485, 0.456, 0.406]))
                self.std = meta.get("std", meta.get("imagenet_std", [0.229, 0.224, 0.225]))
                print(f"Metadata berhasil dimuat: {len(self.class_names)} kelas, ukuran {self.img_size} ✓")
            except Exception as e:
                print(f"Gagal memuat metadata: {e}")
        else:
            print(f"Peringatan: File metadata tidak ditemukan di {self.metadata_path}")

    def _load_model(self):
        if self.model is not None:
            return
            
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"File model tidak ditemukan di {self.model_path}. Silakan latih model atau salin file model ke folder artifacts backend terlebih dahulu.")
            
        try:
            # Gunakan CPU untuk load model secara default agar aman dijalankan di komputer manapun
            self.model = torch.jit.load(self.model_path, map_location='cpu')
            self.model.eval()
            print(f"Model TorchScript berhasil dimuat dari {self.model_path} ✓")
        except Exception as e:
            raise RuntimeError(f"Gagal memuat model TorchScript: {e}")

        # Inisialisasi transformasi gambar
        self.transform = transforms.Compose([
            transforms.Resize((self.img_size, self.img_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=self.mean, std=self.std)
        ])

    def predict(self, image_bytes, top_k=3):
        # Muat model secara malas (lazy loading) jika belum dimuat
        self._load_model()
        
        try:
            # Baca gambar dari byte input
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            
            # Terapkan transformasi preprocessing
            input_tensor = self.transform(image).unsqueeze(0) # Tambahkan batch dimension
            
            # Lakukan inferensi tanpa menghitung gradien
            with torch.no_grad():
                outputs = self.model(input_tensor)
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                
            # Dapatkan top_k probabilitas terbesar dan index-nya
            top_prob, top_indices = torch.topk(probabilities, top_k)
            
            predictions = []
            for prob, idx in zip(top_prob, top_indices):
                idx_val = idx.item()
                prob_val = prob.item()
                
                # Gunakan nama kelas dari metadata jika tersedia, jika tidak gunakan indeks
                if self.class_names and idx_val < len(self.class_names):
                    class_name = self.class_names[idx_val]
                else:
                    class_name = f"Class_{idx_val}"
                    
                predictions.append({
                    "class": class_name,
                    "prob": float(prob_val)
                })
                
            return predictions
        except Exception as e:
            raise RuntimeError(f"Gagal memproses gambar / melakukan prediksi: {e}")
