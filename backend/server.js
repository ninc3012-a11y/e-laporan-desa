const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://e-laporan-desa.vercel.app"
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// =====================
// IMPORT ROUTE
// =====================
const pengaduanRoutes = require("./routes/pengaduan");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const informasiRoutes = require("./routes/informasi");
const notificationRoutes = require("./routes/notification");

// =====================
// PAKAI ROUTE
// =====================
app.use("/api/pengaduan", pengaduanRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/informasi", informasiRoutes);
app.use("/api/notifications", notificationRoutes);

// AKSES GAMBAR
app.use("/api/pengaduan", pengaduanRoutes);
app.use("/api/auth", authRoutes);

// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;