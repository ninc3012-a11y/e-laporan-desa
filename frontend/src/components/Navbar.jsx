import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Info, LogIn, UserPlus, BookOpen } from "lucide-react"; // Tambah BookOpen
import logo from "../assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Update navLinks untuk menambah menu Tentang Desa
  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Tentang Desa", path: "/tentang-desa", icon: <BookOpen size={18} /> }, // Menu baru
    { name: "Informasi", path: "/informasi", icon: <Info size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo Section */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-full bg-white shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300">
              <img
                src={logo}
                alt="Logo Desa Kima Bajo"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">
              Kima <span className="text-indigo-600">Bajo</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${location.pathname === link.path
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <LogIn size={18} />
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
            >
              Daftar
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-indigo-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${location.pathname === link.path
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-2 pt-2"></div>
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            >
              <LogIn size={18} />
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 mt-1"
            >
              <UserPlus size={18} />
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;