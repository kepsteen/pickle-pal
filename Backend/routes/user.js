import express from "express";
import {
	createInitialProfile,
	verifyEmailExists,
	updateProfile,
} from "../controllers/user.controllers.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 10 * 1024 * 1024,
	},

	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only image files are allowed!"), false);
		}
	},
});

// Create Profile
router.post("/", createInitialProfile);
router.get("/:email", verifyEmailExists);
router.patch("/:userId", upload.single("profileImage"), updateProfile);

export const usersRouter = router;
