const router = require("express").Router();
const { signToken } = require("../utils/jwt");

const adminEmail = process.env.ADMIN_EMAIL || "admin@store.com";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const token = signToken({ id: "admin", email: adminEmail, isAdmin: true });
  return res.json({
    user: {
      id: "admin",
      name: "Platform Admin",
      email: adminEmail,
      isAdmin: true,
    },
    token,
  });
});

module.exports = router;
