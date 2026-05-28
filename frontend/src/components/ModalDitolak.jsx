import React, { useState } from "react";
import axios from "axios";

const ModalDitolak = ({ isOpen, onClose, selectedId, onRefresh }) => {
    const [alasanTolak, setAlasanTolak] = useState("");
    const [tanggapan, setTanggapan] = useState("");

    if (!isOpen) return null;

    const handleKirim = async () => {
        if (!alasanTolak) return alert("Pilih alasan penolakan!");
        if (!tanggapan) return alert("Isi catatan tambahan penolakan!");

        try {
            await axios.put(`http://localhost:5000/api/pengaduan/tanggapan/${selectedId}`, {
                status: "Ditolak",
                alasanTolak: alasanTolak,
                tanggapan: tanggapan
            });
            alert("Laporan Berhasil Ditolak!");
            onRefresh(); // Refresh data tabel
            onClose();   // Tutup modal
        } catch (err) {
            console.error(err);
            alert("Gagal mengirim penolakan.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-red-600">Tolak Pengaduan</h2>

                <label className="block text-sm font-semibold text-slate-700 mb-2">Alasan Penolakan</label>
                <select
                    className="w-full border border-slate-200 bg-slate-50 p-3 rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={alasanTolak}
                    onChange={(e) => setAlasanTolak(e.target.value)}
                >
                    <option value="">-- Pilih Alasan --</option>
                    <option value="Informasi Kurang Detail">Informasi Kurang Detail</option>
                    <option value="Bukti Tidak Valid">Bukti Tidak Valid</option>
                    <option value="Bukan Wewenang Desa">Bukan Wewenang Desa</option>
                    <option value="Pengaduan Palsu/Spam">Pengaduan Palsu/Spam</option>
                    <option value="Bahasa Tidak Sopan">Bahasa Tidak Sopan</option>
                </select>

                <label className="block text-sm font-semibold text-slate-700 mb-2">Catatan Tambahan</label>
                <textarea
                    placeholder="Wajib diisi..."
                    className="w-full border border-slate-200 bg-slate-50 p-3 rounded-lg mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
                    value={tanggapan}
                    onChange={(e) => setTanggapan(e.target.value)}
                />

                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold rounded-xl transition-colors">Batal</button>
                    <button onClick={handleKirim} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-colors">Tolak Pengaduan</button>
                </div>
            </div>
        </div>
    );
};

export default ModalDitolak;
