import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Search, Trash2, Loader2, UserCheck, Shield, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "../components/AdminSidebar";

function DataUser() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user");
      setUsers(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const hapus = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini secara permanen? Tindakan ini tidak bisa dibatalkan.")) return;

    try {
      setIsDeleting(id);
      await axios.delete(`http://localhost:5000/api/user/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      alert("User berhasil dihapus ✨");
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus user.");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.nama.toLowerCase().includes(search.toLowerCase()) ||
    user.nik.includes(search)
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
          {/* HEADER SECTION */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Database <span className="text-indigo-600">Pengguna</span>
              </h1>
              <p className="text-slate-500 font-medium mt-1">Manajemen akses dan data penduduk Desa Kima Bajo</p>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white p-5 px-8 flex items-center gap-5"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                <Users size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Terdaftar</p>
                <p className="text-3xl font-black text-slate-800">{users.length}</p>
              </div>
            </motion.div>
          </div>

          {/* SEARCH BAR */}
          <div className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-xl shadow-slate-200/40 border border-white p-6 mb-10">
            <div className="relative group max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Cari berdasarkan Nama atau NIK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">No</th>
                    <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</th>
                    <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor NIK</th>
                    <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hak Akses</th>
                    <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-24 text-center">
                        <Loader2 className="animate-spin mx-auto text-indigo-500 mb-4" size={40} />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sinkronisasi Data...</p>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-24 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="text-slate-200" size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Tidak ada pengguna ditemukan</h3>
                        <p className="text-slate-400 text-sm">Pastikan NIK atau nama yang Anda masukkan benar</p>
                      </td>
                    </tr>
                  ) : (
                    <AnimatePresence>
                      {filteredUsers.map((user, index) => (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={user.id}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          <td className="py-5 px-8 text-sm font-bold text-slate-400">
                            {String(index + 1).padStart(2, '0')}
                          </td>
                          <td className="py-5 px-8">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-400 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-100 uppercase border-2 border-white">
                                {user.nama.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black text-slate-800 tracking-tight">{user.nama}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Terdaftar di Kima Bajo</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-8">
                            <span className="text-sm text-slate-600 font-black font-mono tracking-wider bg-slate-100 px-3 py-1 rounded-lg">
                              {user.nik}
                            </span>
                          </td>
                          <td className="py-5 px-8">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${user.role === "admin"
                                ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                                : "bg-emerald-50 text-emerald-600 border-emerald-100"
                              }`}>
                              {user.role === "admin" ? <Shield size={12} /> : <UserCheck size={12} />}
                              {user.role}
                            </div>
                          </td>
                          <td className="py-5 px-8 text-center">
                            <button
                              disabled={isDeleting === user.id}
                              onClick={() => hapus(user.id)}
                              className="group/btn relative inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-90"
                            >
                              {isDeleting === user.id ? (
                                <Loader2 size={18} className="animate-spin text-rose-500" />
                              ) : (
                                <>
                                  <Trash2 size={18} />
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">Hapus User</span>
                                </>
                              )}
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}

export default DataUser;