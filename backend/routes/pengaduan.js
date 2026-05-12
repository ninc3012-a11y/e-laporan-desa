const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");
const path = require("path");

// =====================
// MULTER UPLOAD CONFIG
// =====================
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Menggunakan Date.now() agar nama file unik dan tetap menjaga ekstensi asli
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// =====================
// 1. GET ALL PENGADUAN (Untuk Admin)
// =====================
router.get("/", async (req, res) => {
  try {
    const data = await prisma.pengaduan.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// 2. GET PENGADUAN BY USER ID (Riwayat User)
// =====================
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await prisma.pengaduan.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// 3. POST PENGADUAN + FOTO (Warga)
// =====================
router.post("/", upload.single("foto"), async (req, res) => {
  try {
    const { judul, isi, lokasi, userId } = req.body;
    const data = await prisma.pengaduan.create({
      data: {
        judul,
        isi,
        lokasi,
        userId: Number(userId),
        foto: req.file ? req.file.filename : null,
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// 4. UPDATE TANGGAPAN & FOTO SELESAI (Admin)
// =====================
router.put("/tanggapan/:id", upload.single("fotoSelesai"), async (req, res) => {
  try {
    const { id } = req.params;
    const { tanggapan, status } = req.body;

    const updateData = {
      tanggapan: tanggapan,
      status: status,
    };

    // Jika ada file fotoSelesai diunggah, tambahkan ke database
    if (req.file) {
      updateData.fotoSelesai = req.file.filename;
    }

    const data = await prisma.pengaduan.update({
      where: {
        id: Number(id),
      },
      data: updateData,
    });

    res.json({
      message: "Status dan tanggapan berhasil diperbarui",
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// 5. DELETE PENGADUAN
// =====================
router.delete("/:id", async (req, res) => {
  try {
    await prisma.pengaduan.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PENTING: Export router agar server.js bisa membaca file ini
module.exports = router;