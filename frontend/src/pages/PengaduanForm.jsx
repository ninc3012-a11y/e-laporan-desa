import { useState } from "react";
import API from "../api";
import { Send, FileText, MapPin, Image as ImageIcon, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PengaduanForm({ onSuccess }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    judul: "",
    isi: "",
    lokasi: "",
    foto: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleFile = (e) => {
    setForm({ ...form, foto: e.target.files[0] });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.judul || !form.isi || !form.lokasi) {
      setError("Judul, isi, dan lokasi wajib diisi.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("judul", form.judul);
      formData.append("isi", form.isi);
      formData.append("lokasi", form.lokasi);
      formData.append("userId", user.id);

      if (form.foto) {
        formData.append("foto", form.foto);
      }

      await API.post("/pengaduan", formData);

      setSuccess("Pengaduan berhasil dikirim! Kami akan segera menindaklanjutinya.");
      setForm({ judul: "", isi: "", lokasi: "", foto: null });

      document.getElementById("foto-upload").value = "";

      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }

    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengirim pengaduan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header section dihapus agar lebih clean */}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border border-red-100"
          >
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 text-emerald-700 p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border border-emerald-100"
          >
            <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-emerald-500" />
            <p className="font-medium">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={submit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* JUDUL */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">Judul Pengaduan</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="judul"
                placeholder="Contoh: Jalan Berlubang di RT 01"
                value={form.judul}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm shadow-sm"
              />
            </div>
          </div>

          {/* LOKASI */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">Lokasi Kejadian</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="lokasi"
                placeholder="Contoh: Depan Kantor Desa"
                value={form.lokasi}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* ISI */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700">Detail Pengaduan</label>
          <textarea
            name="isi"
            placeholder="Jelaskan secara rinci mengenai laporan Anda..."
            value={form.isi}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm min-h-[160px] resize-y shadow-sm"
          />
        </div>

        {/* FOTO */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 border-dashed">
          <label className="block mb-2 text-sm font-semibold text-slate-700">Foto Bukti (Opsional)</label>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center shrink-0">
              <ImageIcon size={24} />
            </div>
            <input
              id="foto-upload"
              type="file"
              onChange={handleFile}
              disabled={isLoading}
              className="w-full file:cursor-pointer file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all text-sm text-slate-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white p-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-indigo-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Mengirim Laporan...
            </>
          ) : (
            <>
              <Send size={20} />
              Kirim Laporan
            </>
          )}
        </button>
      </form>
    </div>
  );
}