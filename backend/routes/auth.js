const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ======================
// REGISTER
// ======================
router.post("/register", async (req, res) => {
  try {
    const { nik, nama, password } = req.body;

    // validasi
    if (!nik || !nama || !password) {
      return res.status(400).json({
        message: "Data belum lengkap",
      });
    }

    // cek user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { nik },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "NIK sudah terdaftar",
      });
    }

    // hash password
    const hash = await bcrypt.hash(password, 10);

    // simpan user
    const user = await prisma.user.create({
      data: {
        nik,
        nama,
        password: hash,
      },
    });

    res.json({
      message: "Register berhasil",
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
      error,
    });
  }
});

// ======================
// LOGIN
// ======================
router.post("/login", async (req, res) => {
  try {

    const { nik, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { nik },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const valid = await bcrypt.compare(
      password,
      user.password
    );

    if (!valid) {
      return res.status(401).json({
        message: "Password salah",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      "SECRET_KEY",
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login berhasil",
      token,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
      error,
    });
  }
});

module.exports = router;