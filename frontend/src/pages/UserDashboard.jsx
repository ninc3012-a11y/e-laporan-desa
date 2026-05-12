import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import PengaduanForm from "./PengaduanForm";
import PengaduanList from "./PengaduanList";
import {
  FileText, Clock, CheckCircle, LogOut, Bell,
  PlusCircle, List, ArrowRight, MessageCircle
} from "lucide-react";
import logo from "../assets/logo.png"; // Import logo resmi

function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [pengaduan, setPengaduan] = useState([]);
  const [activeTab, setActiveTab] = useState("riwayat");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPengaduan = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/pengaduan");
      // Filter laporan milik user yang sedang login
      const myData = res.data.filter((item) => item.user?.nik === user?.nik);
      setPengaduan(myData);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPengaduan();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Statistik Real-time
  const total = pengaduan.length;
  const diproses = pengaduan.filter((item) => item.status === "Diproses").length;
  const selesai = pengaduan.filter((item) => item.status === "Selesai").length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative z-0">
      {/* Background Decorative */}
      <div className="absolute top-0 left-0 w-full h-[420px] bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-800 -z-10 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      {/* HEADER NAVBAR */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center text-white">
        <div className="flex items-center gap-4">
          {/* Logo Resmi Menggantikan Icon User */}
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-white/20 overflow-hidden">
            <img src={logo} alt="Logo Desa" className="w-full h-full object-contain p-1" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter leading-none">Warga<span className="text-indigo-400">Panel</span></h1>
            <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mt-1">Desa Kima Bajo</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="hidden md:block hover:text-indigo-300 transition-colors text-sm font-bold px-4">Beranda</button>
          <button className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all relative group">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-indigo-900"></span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 p-2.5 px-5 rounded-xl transition-all text-sm font-bold"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 pb-20">

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 mb-10 text-white"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter">Halo, {user?.nama.split(' ')[0]}! 👋</h2>
          <p className="text-indigo-100 max-w-2xl text-lg font-medium opacity-80">
            Punya keluhan atau aspirasi? Laporkan sekarang dan pantau progresnya secara transparan di sini.
          </p>
        </motion.div>

        {/* STATISTIK CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Laporan", val: total, icon: FileText, color: "indigo" },
            { label: "Sedang Diproses", val: diproses, icon: Clock, color: "amber" },
            { label: "Telah Selesai", val: selesai, icon: CheckCircle, color: "emerald" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-900/5 border border-white flex items-center gap-5 group hover:shadow-2xl transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <item.icon size={28} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{item.val}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/50 p-1.5 rounded-2xl inline-flex gap-2 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("riwayat")}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black transition-all ${activeTab === "riwayat" ? "bg-white text-indigo-600 shadow-xl" : "text-slate-600 hover:bg-white/50"
                }`}
            >
              <List size={18} /> Riwayat
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black transition-all ${activeTab === "form" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200" : "text-slate-600 hover:bg-white/50"
                }`}
            >
              <PlusCircle size={18} /> Lapor Baru
            </button>
          </div>
        </div>

        {/* TAB CONTENT AREA */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-900/10 border border-slate-100 overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === "riwayat" ? (
              <motion.div
                key="riwayat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8 md:p-10"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Daftar Laporan Anda</h2>
                  <div className="px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {total} Laporan ditemukan
                  </div>
                </div>

                {/* EMPTY STATE LOGIC */}
                {!isLoading && pengaduan.length === 0 ? (
                  <div className="py-20 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                      <MessageCircle size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Laporan</h3>
                    <p className="text-slate-500 max-w-xs mb-8">Anda belum menyampaikan aspirasi atau pengaduan apapun saat ini.</p>
                    <button
                      onClick={() => setActiveTab("form")}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      Buat Laporan Sekarang <ArrowRight size={18} />
                    </button>
                  </div>
                ) : (
                  <PengaduanList data={pengaduan} loading={isLoading} />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 md:p-12 max-w-4xl mx-auto"
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Sampaikan Keluhan Anda</h2>
                  <p className="text-slate-500 font-medium">Isi formulir di bawah ini dengan data yang valid agar dapat segera kami proses.</p>
                </div>
                <PengaduanForm onSuccess={() => {
                  fetchPengaduan();
                  setActiveTab("riwayat");
                }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;