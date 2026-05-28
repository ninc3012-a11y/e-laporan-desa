import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Tambahkan Link untuk navigasi yang lebih baik
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  FileText,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  AlertCircle,
  MessageSquare,
  Clock,
  CheckCircle,
  Inbox
} from "lucide-react";
import heroBg from "../assets/background.jpeg";
import logo from "../assets/logo.png"; // Import logo resmi

function Home() {
  const [informasi, setInformasi] = useState([]);
  const [pengaduan, setPengaduan] = useState([]);

  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [errorInfo, setErrorInfo] = useState("");

  const [isLoadingPengaduan, setIsLoadingPengaduan] = useState(true);

  // =====================
  // FETCH INFORMASI
  // =====================
  const fetchInformasi = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/informasi`);
      setInformasi(res.data);
      setErrorInfo("");
    } catch (err) {
      console.log(err);
      setErrorInfo("Gagal mengambil data informasi. Silakan coba lagi nanti.");
    } finally {
      setIsLoadingInfo(false);
    }
  };

  // =====================
  // FETCH PENGADUAN
  // =====================
  const fetchPengaduan = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/pengaduan`);
      setPengaduan(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingPengaduan(false);
    }
  };

  useEffect(() => {
    fetchInformasi();
    fetchPengaduan();
  }, []);

  // Animasi variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-indigo-200">
      <Navbar />

      {/* HERO SECTION */}
      <section
        className="relative text-white pt-32 pb-20 px-6 md:px-10 min-h-[80vh] flex items-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 text-sm font-medium text-indigo-100">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Layanan Digital Desa Kima Bajo
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-white tracking-tight">
              Suara Anda, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Kemajuan Desa Kita
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl mb-10 text-gray-200 leading-relaxed max-w-2xl">
              Platform resmi pemerintah Desa Kima Bajo untuk menyampaikan aspirasi,
              pengaduan masyarakat, dan mendapatkan informasi terbaru secara cepat, transparan, dan terpercaya.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/login"
                className="inline-flex justify-center items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5"
              >
                <MessageSquare size={20} />
                Buat Pengaduan
              </Link>
              <Link
                to="/informasi"
                className="inline-flex justify-center items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                <FileText size={20} />
                Jelajahi Informasi
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATISTIK SECTION */}
      <section className="relative -mt-16 z-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100"
        >
          <div className="flex items-center gap-6 md:justify-center pt-4 md:pt-0 first:pt-0">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Inbox size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Pengaduan</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {isLoadingPengaduan ? <span className="text-gray-300">...</span> : pengaduan.length}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-6 md:justify-center pt-8 md:pt-0">
            <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Sedang Diproses</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {isLoadingPengaduan ? <span className="text-gray-300">...</span> : pengaduan.filter(p => p.status === "Diproses").length}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-6 md:justify-center pt-8 md:pt-0">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <CheckCircle size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Telah Selesai</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {isLoadingPengaduan ? <span className="text-gray-300">...</span> : pengaduan.filter(p => p.status === "Selesai").length}
              </h3>
            </div>
          </div>
        </motion.div>
      </section>

      {/* INFORMASI SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              Kabar Desa Terbaru
            </h2>
            <p className="text-gray-500 max-w-2xl">
              Ikuti perkembangan terkini, pengumuman, dan kegiatan yang ada di Desa Kima Bajo.
            </p>
          </div>
          <Link to="/informasi" className="hidden md:flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
            Lihat Semua <ChevronRight size={18} />
          </Link>
        </div>

        {errorInfo && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg flex items-start gap-3">
            <AlertCircle className="text-red-500 mt-0.5" size={20} />
            <p className="text-red-700">{errorInfo}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {isLoadingInfo ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))
          ) : informasi.length === 0 && !errorInfo ? (
            <div className="col-span-3 py-16 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada informasi</h3>
              <p className="text-gray-500 max-w-md">
                Saat ini belum ada pengumuman atau berita terbaru dari desa. Silakan kembali lagi nanti.
              </p>
            </div>
          ) : (
            informasi.slice(0, 3).map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={item.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-100 border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative overflow-hidden h-52">
                  <img
                    src={item.gambar || 'https://images.unsplash.com/photo-1572204292164-b35ba40e596b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-700 shadow-sm">
                    Berita
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {item.judul}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {item.isi}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <Clock size={14} />
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    <Link to={`/informasi`} className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50 transition-colors">
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link to="/informasi" className="inline-flex items-center gap-2 text-indigo-600 font-medium px-6 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors">
            Lihat Semua Informasi <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white pt-20 pb-10 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-6 group">
              {/* Logo Bulat Mengganti Kotak K */}
              <div className="w-14 h-14 flex items-center justify-center overflow-hidden rounded-full bg-white shadow-lg border-2 border-slate-700 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={logo}
                  alt="Logo Desa Kima Bajo"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter">
                  Kima <span className="text-indigo-500">Bajo</span>
                </h2>
                <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Portal Informasi Resmi</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md mb-6">
              Platform layanan digital resmi untuk mempermudah masyarakat dalam menyampaikan pengaduan dan mendapatkan informasi desa secara transparan.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white tracking-tight">Menu Cepat</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-medium"><ChevronRight size={16} /> Beranda</Link></li>
              <li><Link to="/tentang-desa" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-medium"><ChevronRight size={16} /> Tentang Desa</Link></li>
              <li><Link to="/informasi" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-medium"><ChevronRight size={16} /> Informasi Desa</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-medium"><ChevronRight size={16} /> Buat Pengaduan</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white tracking-tight">Kontak Kami</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-indigo-400 mt-1 flex-shrink-0" size={18} />
                <span>Jl. Wori-Likupang, Desa Kima Bajo, Kec. Wori, Minahasa Utara</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-indigo-400 flex-shrink-0" size={18} />
                <span>(0431) 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-indigo-400 flex-shrink-0" size={18} />
                <a href="mailto:pemdes@kimabajo.desa.id" className="hover:text-white transition-colors">pemdes@kimabajo.desa.id</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left font-medium">
            © {new Date().getFullYear()} Pemerintah Desa Kima Bajo. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
            <Link to="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <span>•</span>
            <Link to="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;