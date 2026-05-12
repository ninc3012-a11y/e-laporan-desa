import React, { useState } from "react";
import axios from "axios";

const ModalSelesai = ({ isOpen, onClose, selectedId, onRefresh }) => {
    const [tanggapan, setTanggapan] = useState("");
    const [fotoSelesai, setFotoSelesai] = useState(null);

    if (!isOpen) return null;

    const handleKirim = async () => {
        if (!tanggapan || !fotoSelesai) return alert("Isi tanggapan dan foto dulu ya!");

        // POINT 1: Membungkus data ke FormData
        const formData = new FormData();
        formData.append("status", "Selesai");
        formData.append("tanggapan", tanggapan);
        formData.append("fotoSelesai", fotoSelesai); // Key ini harus sama dengan di Backend

        try {
            await axios.put(`http://localhost:5000/api/pengaduan/tanggapan/${selectedId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Laporan Berhasil Diselesaikan!");
            onRefresh(); // Refresh data tabel
            onClose();   // Tutup modal
        } catch (err) {
            console.error(err);
            alert("Gagal mengirim data.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Selesaikan Pengaduan</h2>

                <textarea
                    placeholder="Tulis tanggapan hasil kerja..."
                    className="w-full border p-3 rounded-lg mb-4 text-sm"
                    onChange={(e) => setTanggapan(e.target.value)}
                />

                <input
                    type="file"
                    className="mb-6 block w-full text-sm text-gray-500"
                    onChange={(e) => setFotoSelesai(e.target.files[0])}
                />

                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 py-2 bg-gray-200 rounded-lg">Batal</button>
                    <button onClick={handleKirim} className="flex-1 py-2 bg-green-600 text-white rounded-lg">Kirim</button>
                </div>
            </div>
        </div>
    );
};

export default ModalSelesai;