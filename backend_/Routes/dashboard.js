const express = require("express");
const path = require("path");
const { verifyToken, checkRole } = require("../middleware/auth");

const router = express.Router();

// Admin Dashboard
router.get("/admin", verifyToken, checkRole(["admin"]), (req, res) => {
  res.sendFile(path.resolve(__dirname, "../views/admin.html"));
});

// Faculty Dashboard
router.get("/faculty", verifyToken, checkRole(["faculty"]), (req, res) => {
  res.sendFile(path.resolve(__dirname, "../views/faculty.html"));
});

// Student Dashboard
router.get("/student", verifyToken, checkRole(["student"]), (req, res) => {
  res.sendFile(path.resolve(__dirname, "../views/student.html"));
});

module.exports = router;
