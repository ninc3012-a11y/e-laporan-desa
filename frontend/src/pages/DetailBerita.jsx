import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowLeft, Clock, Share2 } from "lucide-react";

function DetailBerita() {
    const { id } = useParams(); // Mengambil ID berita dari URL
    const navigate = useNavigate();
    const [berita, setBerita] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                // Mengambil data berita tunggal dari backend
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/informasi/${id}`);
                setBerita(res.data);
            } catch (err) {
                console.error("Gagal memuat detail berita:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium">Memuat isi berita...</p>
                </div>
            </div>
        );
    }

    if (!berita) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Berita Tidak Ditemukan</h2>
                <button
                    onClick={() => navigate("/informasi")}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
                >
                    Kembali ke Informasi
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            <Navbar />

            {/* BACKGROUND DECORATION */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 blur-[120px] rounded-full opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-50 blur-[100px] rounded-full opacity-50"></div>
            </div>

            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* NAVIGATION & ACTION */}
                    <div className="flex items-center justify-between mb-12">
                        <button
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-3 text-slate-500 hover:text-indigo-600 font-bold transition-all"
                        >
                            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-indigo-600 group-hover:bg-indigo-50 transition-all">
                                <ArrowLeft size={18} />
                            </div>
                            Kembali
                        </button>
                        <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                            <Share2 size={18} />
                        </button>
                    </div>

                    {/* ARTICLE HEADER */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-indigo-100">
                                Berita Desa
                            </span>
                            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                <Clock size={14} />
                                <span>5 mnt baca</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.15] mb-8 tracking-tight">
                            {berita.judul}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 pb-10 border-b border-slate-100 mb-10 text-slate-500 font-semibold">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600">
                                    <Calendar size={16} />
                                </div>
                                {new Date(berita.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            {berita.lokasi && (
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600">
                                        <MapPin size={16} />
                                    </div>
                                    {berita.lokasi}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* FEATURED IMAGE */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative w-full h-[300px] md:h-[500px] rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl shadow-slate-200"
                    >
                        <img
                            src={berita.gambar || 'https://images.unsplash.com/photo-1572204292164-b35ba40e596b?auto=format&fit=crop&w=1200&q=80'}
                            alt={berita.judul}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* CONTENT */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="prose prose-indigo prose-lg max-w-none"
                    >
                        {/* Menggunakan whitespace-pre-line agar enter/paragraf dari database terbaca */}
                        <p className="text-slate-700 text-xl leading-[1.8] whitespace-pre-line font-medium text-justify md:text-left">
                            {berita.isi}
                        </p>
                    </motion.div>

                    {/* FOOTER DECORATION */}
                    <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">KB</div>
                            <div>
                                <p className="text-slate-900 font-black text-sm uppercase tracking-wider">Pemerintah Desa</p>
                                <p className="text-slate-500 text-xs">Kima Bajo, Sulawesi Utara</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DetailBerita;