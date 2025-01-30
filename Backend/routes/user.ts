import express from "express";
import {
	createUser,
	verifyEmailExists,
	updateProfile,
	getUsers,
	addLike,
} from "../controllers/user.controllers.js";
import multer from "multer";
import { requireAuth } from "@clerk/express";

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
			cb(null, false);
		}
	},
});

// Create Profile
router.post("/", createUser);

// Verify email is unique
router.get("/verify/:email", verifyEmailExists);

// Update Profile
router.patch("/:userId", upload.single("profileImage"), updateProfile);

router.post("/:userId/likes", requireAuth(), addLike);

// Update Settings
// router.post("/:userId/settings", updateSettings);

// Get all users
router.get("/all", getUsers);

export const usersRouter = router;
