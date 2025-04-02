import express from "express"
import multer from "multer"
import path from "path";
import { fileURLToPath } from "url";
import { AddProject, getProject } from "../controllers/projectController.js";

const router = express.Router()

// Define storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files to 'uploads/' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    },
});

const upload = multer({ storage });

router.route("/").post(upload.single("projectFile"),AddProject).get(getProject)




export default router