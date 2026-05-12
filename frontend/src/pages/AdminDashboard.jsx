import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AdminSidebar from "../components/AdminSidebar";

import {
  Bell,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  TrendingUp,
  Search,
  ChevronRight,
  Calendar as CalendarIcon
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Bar,
} from "recharts";

// Variabel animasi untuk Staggered Effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

function AdminDashboard() {
  const [pengaduan, setPengaduan] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pengaduan");
      setPengaduan(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPengaduan = pengaduan.length;
  const diproses = pengaduan.filter((p) => p.status === "Diproses").length;
  const selesai = pengaduan.filter((p) => p.status === "Selesai").length;
  const ditolak = pengaduan.filter((p) => p.status === "Ditolak").length;
  const menunggu = pengaduan.filter((p) => p.status === "Menunggu").length;

  const pieData = [
    { name: "Menunggu", value: menunggu },
    { name: "Diproses", value: diproses },
    { name: "Selesai", value: selesai },
    { name: "Ditolak", value: ditolak },
  ];

  const COLORS = ["#94a3b8", "#f59e0b", "#10b981", "#ef4444"];

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden text-slate-900">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto relative scroll-smooth">
        {/* Dekorasi Background - Glow Effect */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-purple-500/5 blur-[100px] rounded-full -z-10"></div>

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-6 lg:p-10 max-w-7xl mx-auto"
        >
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-6">
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                Ringkasan <span className="text-indigo-600">Statistik</span>
              </h2>
              <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                <CalendarIcon size={14} />
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Cari data..."
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm w-64 transition-all"
                />
              </div>

              <button className="relative bg-white p-3 rounded-2xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
            </motion.div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Total Pengaduan", val: totalPengaduan, icon: FileText, color: "indigo" },
              { label: "Sedang Diproses", val: diproses, icon: Clock, color: "amber" },
              { label: "Laporan Selesai", val: selesai, icon: CheckCircle, color: "emerald" },
              { label: "Laporan Ditolak", val: ditolak, icon: XCircle, color: "rose" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5 group transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={30} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.val}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CHARTS SECTION */}
          <div className="grid lg:grid-cols-5 gap-8 mb-10">
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-800">Distribusi Status</h3>
                  <p className="text-sm text-slate-400">Update status terkini</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl text-indigo-600">
                  <TrendingUp size={20} />
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      outerRadius={100}
                      innerRadius={75}
                      paddingAngle={8}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-800">Grafik Komparasi</h3>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded-lg">BULAN INI</span>
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pieData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[10, 10, 10, 10]}
                      barSize={45}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* RECENT PENGADUAN TABLE */}
          <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-800">Pengaduan Terbaru</h3>
                <p className="text-sm text-slate-400 mt-1">Data masuk 24 jam terakhir</p>
              </div>
              <Link
                to="/kelola-pengaduan"
                className="group flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-2xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all"
              >
                Manajemen Data
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-14 bg-slate-50 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelapor</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Topik Laporan</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pengaduan.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-sm border-2 border-white shadow-sm">
                              {item.user?.nama?.charAt(0) || "U"}
                            </div>
                            <span className="font-bold text-slate-700">{item.user?.nama || "Warga"}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="font-medium text-slate-600 line-clamp-1">{item.judul}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border-2 ${item.status === "Selesai" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            item.status === "Diproses" ? "bg-amber-50 text-amber-600 border-amber-100" :
                              item.status === "Ditolak" ? "bg-rose-50 text-rose-600 border-rose-100" :
                                "bg-slate-100 text-slate-500 border-slate-200"
                            }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right text-slate-400 font-medium text-sm">
                          {new Date(item.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}

export default AdminDashboard;