const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// =====================
// GET ALL (READ)
// =====================
router.get("/", async (req, res) => {
  try {
    const data = await prisma.informasi.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// GET BY ID (PENTING: Untuk fitur Selengkapnya)
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await prisma.informasi.findUnique({
      where: { id: Number(id) }
    });

    if (!data) {
      return res.status(404).json({ message: "Informasi tidak ditemukan" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// CREATE (Ditambah field 'link')
// =====================
router.post("/", async (req, res) => {
  try {
    // Tambahkan 'link' agar bisa menyimpan URL situs resmi
    const { judul, isi, gambar, link } = req.body;

    const data = await prisma.informasi.create({
      data: {
        judul,
        isi,
        gambar,
        link: link || null // Simpan null jika tidak ada link
      }
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// UPDATE (Ditambah field 'link')
// =====================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, isi, gambar, link } = req.body;

    const data = await prisma.informasi.update({
      where: { id: Number(id) },
      data: {
        judul,
        isi,
        gambar,
        link: link || null
      }
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// DELETE
// =====================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.informasi.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;