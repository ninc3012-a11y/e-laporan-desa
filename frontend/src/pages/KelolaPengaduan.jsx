import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Trash2,
  Clock3,
  CheckCircle2,
  XCircle,
  LoaderCircle,
  MessageSquare,
  MapPin,
  Camera,
  Upload,
  Filter,
  Calendar,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "../components/AdminSidebar";
import ModalSelesai from "../components/ModalSelesai";

function KelolaPengaduan() {
  const [data, setData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [tanggapanText, setTanggapanText] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [fotoSelesaiInline, setFotoSelesaiInline] = useState(null);
  const [isModalSelesaiOpen, setIsModalSelesaiOpen] = useState(false);
  const [idForSelesai, setIdForSelesai] = useState(null);
  
  // State baru untuk menghandle teks panjang
  const [expandedId, setExpandedId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pengaduan");
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    if (status === "Selesai") {
      setIdForSelesai(id);
      setIsModalSelesaiOpen(true);
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/pengaduan/tanggapan/${id}`, { status });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const kirimTanggapan = async (id) => {
    if (!tanggapanText) return alert("Harap isi tanggapan terlebih dahulu!");
    try {
      const formData = new FormData();
      formData.append("tanggapan", tanggapanText);
      formData.append("status", "Diproses");

      if (fotoSelesaiInline) {
        formData.append("fotoSelesai", fotoSelesaiInline);
      }

      await axios.put(`http://localhost:5000/api/pengaduan/tanggapan/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Tanggapan berhasil dikirim");
      setTanggapanText("");
      setFotoSelesaiInline(null);
      setSelectedId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim tanggapan");
    }
  };

  const hapus = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pengaduan ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/pengaduan/${id}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredData = data.filter((item) => {
    const cocokSearch =
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.user?.nama?.toLowerCase().includes(search.toLowerCase());
    const cocokStatus = filterStatus === "Semua" || item.status === filterStatus;
    return cocokSearch && cocokStatus;
  });

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden text-slate-900">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto relative scroll-smooth">
        <div className="absolute top-0 left-1/4 w-1/2 h-96 bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 lg:p-10 max-w-6xl mx-auto"
        >
          {/* Header Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Kelola <span className="text-indigo-600">Pengaduan</span>
              </h1>
              <p className="text-slate-500 font-medium mt-1">Pantau dan tindak lanjuti aspirasi warga Desa Kima Bajo</p>
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl text-indigo-700 font-bold text-sm border border-indigo-100">
              <MessageSquare size={18} />
              {filteredData.length} Total Data
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/50 border border-white p-6 mb-10 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Cari judul laporan atau nama warga..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="relative w-full md:w-auto">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full md:w-auto bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-10 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer shadow-sm"
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu">Menunggu</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
          </div>

          {/* Main List */}
          <div className="grid gap-8">
            {loading ? (
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 animate-pulse h-64"></div>
                ))}
              </div>
            ) : filteredData.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Tidak ada pengaduan ditemukan</h3>
              </div>
            ) : (
              filteredData.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={item.id}
                  className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 p-8 lg:p-10 hover:shadow-2xl transition-all group overflow-hidden relative"
                >
                  {/* Status & User Info */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-200">
                          {item.user?.nama?.charAt(0) || "W"}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 text-lg leading-none">{item.user?.nama || "Warga"}</h4>
                          <p className="text-xs font-bold text-slate-400 mt-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                            <Calendar size={12} />
                            {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                        {item.judul}
                      </h2>
                    </div>

                    <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 flex items-center gap-2 shadow-sm
                      ${item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        item.status === 'Diproses' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          item.status === 'Ditolak' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            'bg-slate-100 text-slate-500 border-slate-200'
                      }
                    `}>
                      {item.status === 'Selesai' && <CheckCircle2 size={16} />}
                      {item.status === 'Diproses' && <LoaderCircle size={16} className="animate-spin" />}
                      {item.status === 'Ditolak' && <XCircle size={16} />}
                      {item.status === 'Menunggu' && <Clock3 size={16} />}
                      {item.status}
                    </div>
                  </div>

                  {item.lokasi && (
                    <div className="mb-6 inline-flex items-center gap-2 text-xs font-black text-indigo-700 bg-indigo-50/80 px-4 py-2 rounded-xl border border-indigo-100 uppercase tracking-tighter">
                      <MapPin size={14} />
                      {item.lokasi}
                    </div>
                  )}

                  {/* BAGIAN ISI KELUHAN (UPDATED) */}
                  <div className="bg-slate-50/80 rounded-3xl p-6 mb-8 text-slate-700 leading-relaxed border border-slate-100 font-medium italic relative transition-all duration-500">
                    <p className={`${expandedId === item.id ? "" : "line-clamp-3"} transition-all duration-300`}>
                      "{item.isi}"
                    </p>
                    
                    {item.isi.length > 150 && (
                      <button 
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="mt-4 flex items-center gap-1.5 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:text-indigo-800 transition-colors bg-white px-3 py-1.5 rounded-lg shadow-sm border border-indigo-50"
                      >
                        {expandedId === item.id ? (
                          <><ChevronUp size={14} /> Sembunyikan Keluhan</>
                        ) : (
                          <><ChevronDown size={14} /> Baca Selengkapnya</>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Foto & Tanggapan */}
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {item.foto && (
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 pl-1">Lampiran Foto Warga</span>
                        <div className="relative group/img overflow-hidden rounded-[2rem] border-4 border-white shadow-lg aspect-video md:aspect-auto md:h-56">
                          <img
                            src={`http://localhost:5000/uploads/${item.foto}`}
                            alt="kejadian"
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                          />
                          <div
                            onClick={() => setSelectedImage(`http://localhost:5000/uploads/${item.foto}`)}
                            className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                          >
                            <Search className="text-white" size={32} />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 pl-1">Respon Petugas</span>
                      {item.tanggapan ? (
                        <div className="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-xl shadow-indigo-100 relative overflow-hidden h-full flex flex-col justify-between">
                          <div className="relative z-10">
                            <div className="flex items-center gap-2 font-black text-xs mb-3 uppercase tracking-widest opacity-80">
                              <MessageSquare size={16} />
                              Tanggapan Terkirim
                            </div>
                            <p className="text-sm leading-relaxed font-semibold">{item.tanggapan}</p>
                          </div>
                          {item.fotoSelesai && (
                            <div className="mt-4 pt-4 border-t border-white/20 relative z-10">
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase mb-3 text-indigo-100">
                                <Camera size={14} /> Bukti Penyelesaian
                              </div>
                              <img
                                src={`http://localhost:5000/uploads/${item.fotoSelesai}`}
                                className="w-24 h-16 object-cover rounded-xl border-2 border-white/30 cursor-pointer hover:border-white transition-all shadow-md"
                                onClick={() => setSelectedImage(`http://localhost:5000/uploads/${item.fotoSelesai}`)}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        selectedId !== item.id ? (
                          <button
                            onClick={() => setSelectedId(item.id)}
                            className="w-full h-full min-h-[140px] border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group/btn"
                          >
                            <MessageSquare size={32} className="mb-2 group-hover/btn:scale-110 transition-transform" />
                            <span className="font-black text-[10px] uppercase tracking-widest">Beri Tanggapan Cepat</span>
                          </button>
                        ) : (
                          <div className="bg-white p-6 rounded-[2rem] border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10 space-y-4">
                            <textarea
                              value={tanggapanText}
                              onChange={(e) => setTanggapanText(e.target.value)}
                              placeholder="Ketik tanggapan untuk warga..."
                              className="w-full p-4 text-sm bg-slate-50 border-none rounded-2xl focus:ring-0 resize-none font-medium text-slate-800"
                              rows={3}
                            />
                            <div className="flex flex-col gap-3">
                              <label className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl cursor-pointer transition-all border border-slate-100 group/upload">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-600 shadow-sm group-hover/upload:bg-indigo-600 group-hover/upload:text-white transition-colors">
                                  <Upload size={16} />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                  {fotoSelesaiInline ? "File Terpilih" : "Upload Foto Bukti"}
                                </span>
                                <input type="file" className="hidden" onChange={(e) => setFotoSelesaiInline(e.target.files[0])} />
                              </label>
                              <div className="flex gap-2">
                                <button onClick={() => kirimTanggapan(item.id)} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">Kirim Respon</button>
                                <button onClick={() => { setSelectedId(null); setFotoSelesaiInline(null); }} className="px-5 bg-slate-100 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Batal</button>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-8 border-t border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Update Status:</span>
                    <div className="flex flex-wrap gap-2">
                      {["Menunggu", "Diproses", "Selesai", "Ditolak"].map((st) => (
                        <button
                          key={st}
                          onClick={() => updateStatus(item.id, st)}
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                            ${item.status === st
                              ? 'bg-slate-900 text-white shadow-xl scale-105'
                              : 'bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-slate-600'}
                          `}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                    <div className="flex-1"></div>
                    <button onClick={() => hapus(item.id)} className="p-3 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all">
                      <Trash2 size={22} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.main>
      </div>

      {/* MODAL IMAGE PREVIEW */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex justify-center items-center z-[9999] p-6 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
            >
              <img src={selectedImage} className="max-w-full max-h-full rounded-[2rem] shadow-2xl border-4 border-white/10" />
              <button className="absolute top-0 right-0 bg-white/10 p-3 rounded-full text-white hover:bg-white/20"><X size={24} /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ModalSelesai
        isOpen={isModalSelesaiOpen}
        onClose={() => setIsModalSelesaiOpen(false)}
        selectedId={idForSelesai}
        onRefresh={fetchData}
      />
    </div>
  );
}

export default KelolaPengaduan;