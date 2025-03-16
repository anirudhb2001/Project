const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const cors = require("cors"); // You'll need to install this
const router = express.Router();

// Fix the import syntax - use require instead of import
const path = require('path');

const JWT_SECRET = "your_jwt_secret"; // Change this in production

// Middleware to check user roles
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      
      // Get user with role information
      User.findById(decoded.id).then(user => {
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // Check if user has permitted role
        if (!allowedRoles.includes(user.role)) {
          return res.status(403).json({ message: "Access denied: insufficient permissions" });
        }
        next();
      });
    } catch (err) {
      res.status(401).json({ message: "Token is not valid" });
    }
  };
};

// Signup Route with role selection
router.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;
  
  // Validate role
  const validRoles = ["admin", "faculty", "student"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role specified" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role // Add role to user document
    });
    
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role // Include role in response
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Forgot password endpoint (you'll need to implement email sending logic)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    
    // Here you would normally:
    // 1. Generate a reset token
    // 2. Save it to the user document with an expiration
    // 3. Send an email with a reset link
    
    // For now, just return a success message
    res.json({ message: "If your email exists in our system, you will receive a password reset link shortly." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Protected routes examples
router.get("/admin/dashboard", checkRole(["admin"]), (req, res) => {
  res.json({ message: "Admin dashboard data" });
});

router.get("/faculty/dashboard", checkRole(["admin", "faculty"]), (req, res) => {
  res.json({ message: "Faculty dashboard data" });
});

router.get("/student/dashboard", checkRole(["admin", "faculty", "student"]), (req, res) => {
  res.json({ message: "Student dashboard data" });
});

module.exports = router;