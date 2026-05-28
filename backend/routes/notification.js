const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");

// =====================
// GET NOTIFICATIONS FOR A SPECIFIC USER
// =====================
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await prisma.notification.findMany({
      where: {
        userId: Number(userId),
        forAdmin: false
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20 // Limit to latest 20
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// GET NOTIFICATIONS FOR ADMIN
// =====================
router.get("/admin", async (req, res) => {
  try {
    const data = await prisma.notification.findMany({
      where: {
        forAdmin: true
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20 // Limit to latest 20
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// MARK NOTIFICATION AS READ
// =====================
router.put("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await prisma.notification.update({
      where: {
        id: Number(id),
      },
      data: {
        isRead: true,
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
