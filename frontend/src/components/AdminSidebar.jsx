import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileWarning,
  Newspaper,
  Users,
  FileText,
  LogOut,
  ChevronRight,
  Settings
} from "lucide-react";

// Pastikan Anda sudah menyimpan file logo desa di folder assets
import LogoDesa from "../assets/logo.png";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menus = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin-dashboard" },
    { name: "Kelola Pengaduan", icon: <FileWarning size={20} />, path: "/kelola-pengaduan" },
    { name: "Informasi Desa", icon: <Newspaper size={20} />, path: "/informasi-admin" },
    { name: "Data User", icon: <Users size={20} />, path: "/data-user" },
    { name: "Laporan", icon: <FileText size={20} />, path: "/laporan" },
  ];

  return (
    <aside className="w-72 min-h-screen bg-[#0f172a] text-slate-300 p-6 flex flex-col relative overflow-hidden z-20 border-r border-slate-800 shadow-2xl">

      {/* Background Decorative Glows */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-20 -right-20 w-40 h-40 bg-purple-600/10 blur-[80px] rounded-full"></div>

      {/* LOGO SECTION DENGAN LOGO DESA */}
      <div className="mb-12 relative z-10 px-2">
        <div className="flex items-center gap-4 mb-1">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-14 h-14 bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-xl flex items-center justify-center"
          >
            {/* Logo Desa Kima Bajo */}
            <img
              src={LogoDesa}
              alt="Logo Desa Kima Bajo"
              className="w-full h-full object-contain"
            />
          </motion.div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-none">
              Admin<span className="text-indigo-400">Panel</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">
              Desa Kima Bajo
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <div className="space-y-1.5 flex-1 relative z-10">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-4 px-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50"></div>
          Menu Utama
        </div>

        {menus.map((menu, index) => {
          const isActive = location.pathname === menu.path;
          return (
            <Link
              key={index}
              to={menu.path}
              className={`flex items-center justify-between group px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 relative ${isActive
                ? "text-white bg-indigo-600/10 border border-indigo-500/20"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent rounded-2xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div className="flex items-center gap-3.5 relative z-10">
                <div className={`transition-all duration-300 ${isActive ? "text-indigo-400 scale-110" : "text-slate-500 group-hover:text-indigo-400"
                  }`}>
                  {menu.icon}
                </div>
                <span className="text-sm tracking-wide">{menu.name}</span>
              </div>

              {isActive && (
                <motion.div
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <ChevronRight size={14} className="text-indigo-400" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>

      {/* BOTTOM SECTION: LOGOUT */}
      <div className="relative z-10 space-y-4 pt-6 border-t border-slate-800/60">

        {/* WIDGET PROFIL ADMIN DIKOMENTARI (TIDAK TAMPIL) 
        <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-slate-800/30 border border-slate-700/50">
          <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-xs font-black text-white shadow-inner">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Admin Kima Bajo</p>
            <p className="text-[10px] text-slate-500 font-medium truncate italic">Online Status</p>
          </div>
          <Settings size={14} className="text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors" />
        </div> 
        */}

        <button
          onClick={logout}
          className="flex items-center justify-center gap-3 w-full p-3.5 rounded-2xl font-bold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-rose-600/20 border border-transparent hover:border-rose-500/30 hover:shadow-[0_0_20px_rgba(225,29,72,0.1)] transition-all duration-300 group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          <span className="text-sm">Logout</span>
        </button>
      </div>

    </aside>
  );
}

export default AdminSidebar;