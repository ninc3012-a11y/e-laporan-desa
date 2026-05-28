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
// FILTER WORDS & UTILS
// =====================
const badWords = [
  "anjing", "babi", "bangsat", "tolol", "goblok",
  "kontol", "memek", "jembut", "pantek", "perek",
  "pelacur", "lonte", "bajingan", "asu", "tai",
  "kampret", "sialan", "ngentot"
];

const containsBadWord = (text) => {
  if (!text) return false;
  return badWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(text);
  });
};

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

    // Validasi panjang minimum
    if (!isi || isi.length < 15) {
      return res.status(400).json({ message: "Deskripsi pengaduan minimal 15 karakter agar jelas." });
    }

    // Filter kata kasar
    if (containsBadWord(judul) || containsBadWord(isi)) {
      return res.status(400).json({ message: "Pengaduan mengandung bahasa tidak sopan atau kata kasar. Harap perbaiki bahasa Anda." });
    }

    // Cek duplikasi
    // Mencari pengaduan dengan lokasi yang sama atau judul yang mirip (contains) yang statusnya belum selesai/ditolak
    const existingPengaduan = await prisma.pengaduan.findFirst({
      where: {
        AND: [
          { status: { in: ["Menunggu", "Diproses"] } },
          { lokasi: { equals: lokasi } }
        ]
      }
    });

    if (existingPengaduan) {
      return res.status(409).json({
        message: `Terdapat pengaduan yang sedang diproses di lokasi tersebut ("${existingPengaduan.judul}"). Silakan pantau pengaduan yang sudah ada.`,
        existingId: existingPengaduan.id
      });
    }

    const data = await prisma.pengaduan.create({
      data: {
        judul,
        isi,
        lokasi,
        userId: Number(userId),
        foto: req.file ? req.file.filename : null,
      },
    });

    // Create notification for admin
    await prisma.notification.create({
      data: {
        pesan: `Ada pengaduan baru: "${judul}" di ${lokasi || 'lokasi tidak disebutkan'}`,
        forAdmin: true
      }
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
    const { tanggapan, status, alasanTolak } = req.body;

    const updateData = {
      tanggapan: tanggapan,
      status: status,
    };

    // Tambahkan alasan tolak jika status Ditolak
    if (status === "Ditolak" && alasanTolak) {
      updateData.alasanTolak = alasanTolak;
    }

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

    // Create notification for user
    await prisma.notification.create({
      data: {
        pesan: `Status pengaduan Anda "${data.judul}" diperbarui menjadi: ${status}.`,
        userId: data.userId,
        forAdmin: false
      }
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