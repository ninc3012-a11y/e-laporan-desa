import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Loader2, CreditCard, Lock, AlertCircle, ChevronLeft } from "lucide-react";
import heroBg from "../assets/background.jpeg";
import logo from "../assets/logo.png"; // Import logo resmi

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nik: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (error) setError(""); // Clear error when typing
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.nik || !form.password) {
      setError("NIK dan Password wajib diisi");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          nik: form.nik,
          password: form.password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat login. Silakan coba lagi.");
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

          <div className="text-center mb-10 mt-4">
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
            <p className="text-gray-500 mt-2 font-medium">Masuk ke akun Anda untuk melanjutkan</p>
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

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              {/* NIK */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">NIK (Nomor Induk Kependudukan)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CreditCard className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="text"
                    name="nik"
                    placeholder="Masukkan NIK Anda"
                    value={form.nik}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${error ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 bg-gray-50/50 focus:ring-indigo-500'} focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">Lupa Password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Masukkan Password Anda"
                    value={form.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${error ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 bg-gray-50/50 focus:ring-indigo-500'} focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                </div>
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
                "Masuk Sekarang"
              )}
            </button>

            <p className="text-center text-sm text-gray-500 font-medium mt-6">
              Belum punya akun?{" "}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">
                Daftar di sini
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;