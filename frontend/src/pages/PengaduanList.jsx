import { useEffect, useState } from "react";
import API from "../api";
import { MapPin, Calendar, MessageSquare, CheckCircle2, Clock, XCircle, MoreHorizontal, Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PengaduanList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // State baru untuk mengontrol foto mana yang sedang diperbesar
  const [selectedPreview, setSelectedPreview] = useState(null);

  useEffect(() => {
    fetchPengaduan();
  }, []);

  const fetchPengaduan = async () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return;
      const user = JSON.parse(userString);
      const res = await API.get(`/pengaduan/user/${user.id}`);
      setData(res.data);
    } catch (err) {
      console.log("Error fetch pengaduan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Menunggu":
        return { color: "bg-slate-100 text-slate-600 border-slate-200", icon: <MoreHorizontal size={14} /> };
      case "Diproses":
        return { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: <Clock size={14} /> };
      case "Selesai":
        return { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={14} /> };
      case "Ditolak":
        return { color: "bg-red-50 text-red-700 border-red-200", icon: <XCircle size={14} /> };
      default:
        return { color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: <MoreHorizontal size={14} /> };
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-slate-50 rounded-3xl animate-pulse border border-slate-100"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* MODAL LIGHTBOX UNTUK ZOOM FOTO */}
      <AnimatePresence>
        {selectedPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPreview(null)}
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-auto max-h-full flex flex-col items-center"
            >
              <button
                onClick={() => setSelectedPreview(null)}
                className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>
              <img
                src={selectedPreview}
                alt="Zoom view"
                className="rounded-2xl shadow-2xl max-h-[80vh] object-contain border-4 border-white/10"
              />
              <p className="mt-4 text-white/60 text-sm font-medium">Klik di mana saja untuk kembali</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {data.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm border border-slate-100">
            <MessageSquare className="text-slate-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-700">Belum Ada Pengaduan</h3>
          <p className="text-slate-500 mt-2 max-w-sm leading-relaxed">Anda belum pernah membuat laporan.</p>
        </div>
      ) : (
        data.map((item, index) => {
          const statusConfig = getStatusConfig(item.status);
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item.id}
              className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 transition-all group"
            >
              {/* HEADER (Judul & Status) */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {item.judul}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                      <Calendar size={16} className="text-slate-400" />
                      {new Date(item.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    {item.lokasi && (
                      <span className="flex items-center gap-1.5 bg-indigo-50/50 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-100">
                        <MapPin size={16} />
                        {item.lokasi}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-bold border flex items-center gap-2 whitespace-nowrap shrink-0 ${statusConfig.color}`}>
                  {statusConfig.icon}
                  {item.status}
                </div>
              </div>

              {/* ISI LAPORAN */}
              <p className="text-slate-600 leading-relaxed text-base mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {item.isi}
              </p>

              {/* FOTO KEJADIAN & TANGGAPAN */}
              <div className="flex flex-col md:flex-row gap-6">
                {item.foto && (
                  <div className="md:w-1/3 shrink-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Foto Kejadian:</p>
                    <div
                      onClick={() => setSelectedPreview(`http://localhost:5000/uploads/${item.foto}`)}
                      className="w-full h-40 overflow-hidden rounded-2xl border border-slate-200 shadow-sm cursor-zoom-in"
                    >
                      <img
                        src={`http://localhost:5000/uploads/${item.foto}`}
                        alt="foto bukti"
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>
                )}

                {item.tanggapan && (
                  <div className="flex-1 p-5 bg-indigo-50/50 border border-indigo-100 rounded-3xl relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500"></div>
                    <div className="flex flex-col sm:flex-row gap-4 h-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-indigo-700 font-bold mb-3 text-sm uppercase tracking-wide">
                          <MessageSquare size={18} />
                          Tanggapan Desa:
                        </div>
                        <p className="text-slate-700 text-base italic leading-relaxed">"{item.tanggapan}"</p>
                      </div>

                      {/* FOTO HASIL KERJA */}
                      {item.fotoSelesai && (
                        <div className="sm:w-40 shrink-0">
                          <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2 text-[10px] uppercase tracking-wider">
                            <Camera size={14} />
                            Hasil Kerja:
                          </div>
                          <div
                            onClick={() => setSelectedPreview(`http://localhost:5000/uploads/${item.fotoSelesai}`)}
                            className="overflow-hidden rounded-xl border-2 border-white shadow-md cursor-zoom-in group-hover:rotate-1 transition-transform"
                          >
                            <img
                              src={`http://localhost:5000/uploads/${item.fotoSelesai}`}
                              alt="Hasil"
                              className="w-full h-24 object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}