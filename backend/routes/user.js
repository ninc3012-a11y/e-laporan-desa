const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");

// ==========================
// GET ALL USER
// ==========================
router.get("/", async (req, res) => {

  try {

    const users = await prisma.user.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.json(users);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Gagal mengambil data user",
    });
  }
});

// ==========================
// DELETE USER
// ==========================
router.delete("/:id", async (req, res) => {

  try {

    await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "User berhasil dihapus",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Gagal menghapus user",
    });
  }
});

module.exports = router;