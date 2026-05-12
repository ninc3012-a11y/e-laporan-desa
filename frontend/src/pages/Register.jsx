import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Loader2, CreditCard, Lock, User, AlertCircle, CheckCircle, ChevronLeft } from "lucide-react";
import heroBg from "../assets/background.jpeg";
import logo from "../assets/logo.png"; // Import logo resmi

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    nik: "",
    nama: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.nik || !form.nama || !form.password) {
      setError("Semua kolom wajib diisi");
      return;
    }

    if (form.nik.length < 16) {
      setError("NIK harus minimal 16 karakter");
      return;
    }

    if (form.password.length < 6) {
      setError("Password harus minimal 6 karakter");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          nik: form.nik,
          nama: form.nama,
          password: form.password,
        }
      );

      setSuccess("Registrasi berhasil! Silakan menuju halaman Login untuk masuk.");
      setForm({ nik: "", nama: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat registrasi. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen font-sans flex flex-col relative overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md z-0"></div>

      <div className="relative z-10 w-full">
        <Navbar />
      </div>

      <div className="flex-1 flex justify-center items-center py-24 px-6 z-10 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-indigo-100/50 border border-white w-full max-w-md relative"
        >
          <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-indigo-600 transition-colors">
            <ChevronLeft size={24} />
          </Link>

          <div className="text-center mb-8 mt-4">
            {/* Logo Bulat Resmi menggantikan kotak K */}
            <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-full bg-white shadow-xl border-4 border-white mx-auto mb-4 hover:scale-110 transition-transform duration-300">
              <img
                src={logo}
                alt="Logo Desa Kima Bajo"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
              Kima <span className="text-indigo-600">Bajo</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Buat akun untuk mengakses layanan desa</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border border-red-100"
            >
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-emerald-50 text-emerald-700 p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border border-emerald-100"
            >
              <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-emerald-500" />
              <div className="flex-1">
                <p className="font-semibold mb-1">{success}</p>
                <Link to="/login" className="text-emerald-700 underline font-medium hover:text-emerald-800">
                  Pergi ke halaman Login
                </Link>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* NIK */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">NIK (Nomor Induk Kependudukan)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CreditCard className={`h-5 w-5 ${error && !form.nik ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  name="nik"
                  placeholder="Masukkan 16 digit NIK"
                  value={form.nik}
                  onChange={handleChange}
                  disabled={isLoading}
                  maxLength={16}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${error && !form.nik ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 bg-gray-50/50 focus:ring-indigo-500'} focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
              </div>
            </div>

            {/* NAMA */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${error && !form.nama ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  name="nama"
                  placeholder="Masukkan nama sesuai KTP"
                  value={form.nama}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${error && !form.nama ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 bg-gray-50/50 focus:ring-indigo-500'} focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${error && !form.password ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${error && !form.password ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 bg-gray-50/50 focus:ring-indigo-500'} focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white p-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Memproses...
                </>
              ) : (
                "Daftar Sekarang"
              )}
            </button>

            <p className="text-center text-sm text-gray-500 font-medium mt-6">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">
                Masuk di sini
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;