import { useEffect, useState } from "react";
import axios from "axios";
import {
  Newspaper,
  ImageIcon,
  Pencil,
  Trash2,
  PlusCircle,
  Link as LinkIcon,
  Search,
  Calendar,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "../components/AdminSidebar";

function InformasiAdmin() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    judul: "",
    isi: "",
    gambar: "",
    link: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/informasi");
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/informasi/${editId}`, form);
        alert("Informasi berhasil diperbarui ✨");
      } else {
        await axios.post("http://localhost:5000/api/informasi", form);
        alert("Informasi baru ditambahkan 🚀");
      }
      setForm({ judul: "", isi: "", gambar: "", link: "" });
      setEditId(null);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const hapus = async (id) => {
    if (!window.confirm("Yakin ingin menghapus berita ini dari publik?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/informasi/${id}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const editData = (item) => {
    setForm({
      judul: item.judul,
      isi: item.isi,
      gambar: item.gambar || "",
      link: item.link || "",
    });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredData = data.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden text-slate-900">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto relative scroll-smooth">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-1/4 w-1/2 h-96 bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 lg:p-10 max-w-7xl mx-auto"
        >
          {/* HEADER */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Kelola <span className="text-indigo-600">Informasi</span>
              </h1>
              <p className="text-slate-500 font-medium mt-1">Publikasikan berita dan pengumuman terbaru untuk warga</p>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Cari judul berita..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm w-full md:w-80 transition-all"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* FORM SECTION (Sticky) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-8 sticky top-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${editId ? 'bg-amber-50 text-amber-600 shadow-amber-100' : 'bg-indigo-50 text-indigo-600 shadow-indigo-100'}`}>
                    {editId ? <Pencil size={24} /> : <PlusCircle size={24} />}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800">
                      {editId ? "Edit Berita" : "Tulis Berita"}
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Editor Informasi</p>
                  </div>
                </div>

                <form onSubmit={submit} className="space-y-5">
                  <div>
                    <label className="block mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Judul Utama</label>
                    <input
                      type="text"
                      name="judul"
                      value={form.judul}
                      onChange={handleChange}
                      placeholder="Contoh: Jadwal Posyandu Mei 2026"
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-800"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Thumbnail (URL)</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input
                          type="text"
                          name="gambar"
                          value={form.gambar}
                          onChange={handleChange}
                          placeholder="Link foto"
                          className="w-full bg-slate-50 border border-slate-100 pl-11 p-3.5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-xs font-medium transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Link Resmi</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input
                          type="text"
                          name="link"
                          value={form.link}
                          onChange={handleChange}
                          placeholder="URL Situs"
                          className="w-full bg-slate-50 border border-slate-100 pl-11 p-3.5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-xs font-medium transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Konten Berita</label>
                    <textarea
                      name="isi"
                      value={form.isi}
                      onChange={handleChange}
                      placeholder="Ceritakan detail informasinya di sini..."
                      rows="6"
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium leading-relaxed"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    {editId && (
                      <button
                        type="button"
                        onClick={() => { setEditId(null); setForm({ judul: "", isi: "", gambar: "", link: "" }); }}
                        className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                      >
                        Batal
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                      {editId ? "Simpan Perubahan" : "Terbitkan Informasi"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* LIST SECTION */}
            <div className="lg:col-span-7">
              <div className="grid gap-6">
                {loading ? (
                  <div className="h-40 bg-white rounded-3xl animate-pulse"></div>
                ) : filteredData.length === 0 ? (
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-20 text-center">
                    <Newspaper className="mx-auto text-slate-200 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-slate-800">Belum ada informasi</h3>
                    <p className="text-slate-400 mt-1">Silakan tambah berita pertama Anda</p>
                  </div>
                ) : (
                  filteredData.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all group flex flex-col md:flex-row"
                    >
                      <div className="md:w-56 h-56 md:h-auto overflow-hidden shrink-0">
                        {item.gambar ? (
                          <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                            <ImageIcon size={40} />
                          </div>
                        )}
                      </div>

                      <div className="p-8 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                              <Calendar size={12} />
                              {new Date(item.createdAt).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                            <h2 className="text-xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                              {item.judul}
                            </h2>
                          </div>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noreferrer" className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm shadow-emerald-100">
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>

                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-6 font-medium">
                          {item.isi}
                        </p>

                        <div className="flex items-center justify-end gap-3 mt-auto pt-5 border-t border-slate-50">
                          <button
                            onClick={() => editData(item)}
                            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl text-amber-600 bg-amber-50 hover:bg-amber-100 transition-all"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            onClick={() => hapus(item.id)}
                            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all"
                          >
                            <Trash2 size={12} /> Hapus
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}

export default InformasiAdmin;