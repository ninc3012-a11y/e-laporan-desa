const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Pengaduan Desa Running...");
});


// API REGISTER TARUH DI SINI
app.post("/register", async (req, res) => {
  try {
    const { nik, nama, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { nik },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "NIK sudah terdaftar",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nik,
        nama,
        password: hashedPassword,
      },
    });

    res.json({
      message: "Register berhasil",
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});