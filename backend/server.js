const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// =====================
// IMPORT ROUTE
// =====================
const pengaduanRoutes = require("./routes/pengaduan");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const informasiRoutes = require("./routes/informasi");

// =====================
// PAKAI ROUTE
// =====================
app.use("/api/pengaduan", pengaduanRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/informasi", informasiRoutes);

// AKSES GAMBAR
app.use("/api/pengaduan", pengaduanRoutes);
app.use("/api/auth", authRoutes);

// =====================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});