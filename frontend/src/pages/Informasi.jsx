import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Search, FileText, Calendar, ChevronRight, Newspaper, ExternalLink } from "lucide-react";

function Informasi() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/informasi`);
      setData(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Gagal memuat informasi. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden bg-[#f8fafc]">
      {/* 1. MODERN MESH GRADIENT BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-200/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[50%] bg-purple-200/20 blur-[100px] rounded-full"></div>
        <div className="absolute top-[20%] right-[10%] w-[25%] h-[25%] bg-blue-100/30 blur-[80px] rounded-full"></div>

        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}>
        </div>
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>

      <div className="relative z-10 pt-32 px-6 pb-20">
        <div className="max-w-6xl mx-auto">

          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-bold tracking-[0.2em] text-indigo-600 uppercase bg-indigo-50/80 backdrop-blur-md rounded-xl border border-indigo-100">
                <Newspaper size={14} /> Portal Informasi Desa
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
                Berita <span className="text-indigo-600">Terkini</span>
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed font-medium">
                Ikuti terus perkembangan, pengumuman, dan berita terbaru dari Desa Kima Bajo.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative w-full md:w-80"
            >
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-indigo-500" />
              </div>
              <input
                type="text"
                placeholder="Cari berita..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-white bg-white/70 backdrop-blur-2xl shadow-2xl shadow-indigo-100/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300"
              />
            </motion.div>
          </div>

          {/* ARTICLE LIST */}
          <div className="grid grid-cols-1 gap-12">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="h-80 bg-white/40 rounded-[3rem] animate-pulse border border-white"></div>
              ))
            ) : filteredData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-32 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-md rounded-[3rem] border border-white border-dashed"
              >
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <FileText className="text-indigo-200" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Belum ada berita dipublikasikan</h3>
              </motion.div>
            ) : (
              filteredData.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  key={item.id}
                  className="group relative bg-white/60 backdrop-blur-md rounded-[3rem] border border-white shadow-sm hover:shadow-2xl hover:shadow-indigo-200/30 transition-all duration-500 overflow-hidden flex flex-col md:flex-row"
                >
                  <div
                    className="w-full md:w-[450px] h-72 md:h-auto overflow-hidden cursor-pointer"
                    onClick={() => {
                      if (item.link) window.open(item.link, "_blank");
                      else if (item.isi.length > 150) navigate(`/informasi/${item.id}`);
                    }}
                  >
                    <img
                      src={item.gambar || 'https://images.unsplash.com/photo-1572204292164-b35ba40e596b?auto=format&fit=crop&w=800&q=80'}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                    />
                  </div>

                  <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-tighter">
                        <Calendar size={12} />
                        {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                      </div>
                      <div className="h-[1px] flex-1 bg-slate-200"></div>
                    </div>

                    <h2
                      className="text-3xl md:text-4xl font-black text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors leading-[1.2] cursor-pointer"
                      onClick={() => {
                        if (item.link) window.open(item.link, "_blank");
                        else if (item.isi.length > 150) navigate(`/informasi/${item.id}`);
                      }}
                    >
                      {item.judul}
                    </h2>

                    <p className="text-slate-500 text-lg leading-relaxed line-clamp-3 mb-10">
                      {item.isi}
                    </p>

                    {/* LOGIKA TOMBOL KONDISIONAL */}
                    <div className="mt-auto">
                      {item.link ? (
                        /* OPSI 1: Link Website Resmi */
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn flex items-center gap-4 text-emerald-600 font-black text-sm tracking-[0.2em] uppercase w-fit"
                        >
                          Kunjungi Situs Resmi
                          <div className="w-12 h-12 rounded-full border-2 border-emerald-100 flex items-center justify-center group-hover/btn:bg-emerald-600 group-hover/btn:border-emerald-600 group-hover/btn:text-white transition-all duration-300 shadow-lg shadow-emerald-100">
                            <ExternalLink size={20} className="group-hover/btn:scale-110 transition-transform" />
                          </div>
                        </a>
                      ) : item.isi.length > 150 ? (
                        /* OPSI 2: Berita Internal Panjang */
                        <button
                          onClick={() => navigate(`/informasi/${item.id}`)}
                          className="group/btn flex items-center gap-4 text-indigo-600 font-black text-sm tracking-[0.2em] uppercase w-fit"
                        >
                          Selengkapnya
                          <div className="w-12 h-12 rounded-full border-2 border-indigo-100 flex items-center justify-center group-hover/btn:bg-indigo-600 group-hover/btn:border-indigo-600 group-hover/btn:text-white transition-all duration-300 shadow-lg shadow-indigo-100 group-hover/btn:shadow-indigo-200">
                            <ChevronRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
                          </div>
                        </button>
                      ) : null /* OPSI 3: Informasi Pendek (Tanpa Tombol) */}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Informasi;