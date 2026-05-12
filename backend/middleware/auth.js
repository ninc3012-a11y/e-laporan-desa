const jwt = require("jsonwebtoken");

// cek token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // format: Bearer TOKEN
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token invalid" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded; // simpan data user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

// cek admin
function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses hanya untuk admin" });
  }
  next();
}

module.exports = { verifyToken, isAdmin };