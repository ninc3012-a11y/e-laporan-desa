import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Pengaduan from "./pages/Pengaduan";
import History from "./pages/History";
import Informasi from "./pages/Informasi";
import TentangDesa from "./pages/TentangDesa"; // 1. Import halaman baru

import ProtectedRoute from "./components/ProtectedRoute";

import KelolaPengaduan from "./pages/KelolaPengaduan";
import DataUser from "./pages/DataUser";
import Laporan from "./pages/Laporan";
import InformasiAdmin from "./pages/InformasiAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tentang-desa" element={<TentangDesa />} /> {/* 2. Tambah rute tentang desa */}

        {/* USER */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="warga">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/pengaduan" element={<Pengaduan />} />
        <Route path="/history" element={<History />} />
        <Route path="/informasi" element={<Informasi />} />

        {/* ADMIN */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kelola-pengaduan"
          element={
            <ProtectedRoute role="admin">
              <KelolaPengaduan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/data-user"
          element={
            <ProtectedRoute role="admin">
              <DataUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/laporan"
          element={
            <ProtectedRoute role="admin">
              <Laporan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/informasi-admin"
          element={
            <ProtectedRoute role="admin">
              <InformasiAdmin />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;