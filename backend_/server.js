import express from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";  // Import dotenv
import fs from "fs";

// Load environment variables
dotenv.config();  

import ProjectRoutes from "./Routes/projectRoute.js";
import AuthRoutes from "./routes/auth.js";

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const app = express();
app.use(cors());
app.use(express.json());

// Debugging: Check if MONGO_URI is loaded
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is undefined. Check your .env file.");
  process.exit(1);
}

// MongoDB Connection
connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/auth", AuthRoutes);
app.use("/api/project", ProjectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
