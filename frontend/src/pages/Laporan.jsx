import { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Search,
  Printer,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import AdminSidebar from "../components/AdminSidebar";

function Laporan() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/pengaduan`);
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

  const filteredData = data.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase()) ||
    item.user?.nama?.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = (status) => {
    switch (status) {
      case "Menunggu": return "bg-slate-100 text-slate-700 border-slate-200";
      case "Diproses": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Selesai": return "bg-green-50 text-green-700 border-green-200";
      case "Ditolak": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const printLaporan = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      {/* Sidebar - no-print akan menyembunyikannya saat cetak */}
      <div className="no-print h-full">
        <AdminSidebar />
      </div>

      <div className="flex-1 overflow-y-auto relative no-print-scroll">
        {/* Dekorasi BG - no-print */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-indigo-400/10 blur-3xl rounded-full -z-10 pointer-events-none no-print"></div>

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 lg:p-10 max-w-7xl mx-auto no-print"
        >
          {/* HEADER DASHBOARD */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Laporan <span className="text-indigo-600">Arsip</span>
              </h1>
              <p className="text-slate-500 font-medium mt-1">Dokumentasi fisik pengaduan warga Desa Kima Bajo</p>
            </div>
            <button
              onClick={printLaporan}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              <Printer size={20} />
              Cetak PDF
            </button>
          </div>

          {/* SEARCH */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-white p-6 mb-10">
            <div className="relative max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Cari data arsip..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* TABLE PREVIEW */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">No</th>
                    <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Informasi</th>
                    <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelapor</th>
                    <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan="4" className="py-20 text-center font-bold text-slate-300">Memuat...</td></tr>
                  ) : filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-6 px-8 text-sm font-bold text-slate-400">{index + 1}</td>
                      <td className="py-6 px-8">
                        <p className="font-black text-slate-800">{item.judul}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.isi}</p>
                      </td>
                      <td className="py-6 px-8 font-bold text-slate-700 text-sm">{item.user?.nama}</td>
                      <td className="py-6 px-8">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${statusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.main>

        {/* ============================================================
            AREA CETAK (TAMPIL HANYA SAAT DI-PDF/PRINT)
           ============================================================ */}
        <div className="print-only p-8 bg-white text-black font-serif">
          {/* KOP SURAT SESUAI REQUEST */}
          <div className="flex flex-col items-center justify-center border-b-[3px] border-black pb-4 mb-6 text-center">
            <h2 className="text-xl font-bold uppercase tracking-tight">Pemerintah Kabupaten Minahasa Utara</h2>
            <h2 className="text-xl font-bold uppercase tracking-tight">Kecamatan Wori</h2>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Desa Kima Bajo</h1>
            <p className="text-sm italic">Jl. Raya Wori-Likupang, Kode Pos 95351</p>
          </div>

          <h3 className="text-center text-lg font-bold underline mb-6 uppercase">Laporan Rekapitulasi Pengaduan</h3>

          <table className="w-full border-collapse border border-black text-[11px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 w-6 text-center">No</th>
                <th className="border border-black p-2 w-24 text-center">Tanggal</th>
                <th className="border border-black p-2">Nama Pelapor</th>
                <th className="border border-black p-2">Judul Pengaduan</th>
                <th className="border border-black p-2 text-center w-20">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-black p-2 text-center">{index + 1}</td>
                  <td className="border border-black p-2 text-center">{new Date(item.createdAt).toLocaleDateString('id-ID')}</td>
                  <td className="border border-black p-2 font-semibold">{item.user?.nama}</td>
                  <td className="border border-black p-2">{item.judul}</td>
                  <td className="border border-black p-2 text-center font-bold uppercase">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TANDA TANGAN */}
          <div className="mt-12 flex justify-end">
            <div className="text-center w-56 text-sm">
              <p>Kima Bajo, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-bold mb-20 uppercase">Hukum Tua Desa Kima Bajo,</p>
              <p className="font-bold underline uppercase underline-offset-4">..........................................</p>
              <p>NIP. ..........................................</p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS KHUSUS PRINT */}
      <style>{`
        .print-only { display: none; }
        
        @media print {
          /* Hilangkan sidebar dan elemen dashboard */
          .no-print, 
          .no-print * { 
            display: none !important; 
          }

          /* Munculkan area cetak */
          .print-only { 
            display: block !important; 
          }

          /* Reset Container */
          .no-print-scroll { 
            overflow: visible !important; 
            height: auto !important; 
            flex: none !important;
            width: 100% !important;
          }

          /* Aturan Halaman Portrait */
          @page {
            size: portrait;
            margin: 2cm;
          }

          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }
        }
      `}</style>
    </div>
  );
}

export default Laporan;