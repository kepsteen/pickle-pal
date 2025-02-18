import express from "express";
import {
	createUser,
	verifyEmailExists,
	updateProfile,
	getUsers,
	addLike,
	getPals,
	getMessages,
	getUserById,
	getPairs,
	getCurrentPair,
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

// Get current pair
router.get("/current-pair", requireAuth(), getCurrentPair);

// Get all pals
router.get("/pals", requireAuth(), getPals);

// Update Settings
// router.post("/:userId/settings", updateSettings);

// Get all users
router.get("/all", getUsers);

// Get all pairs
router.get("/pairs", requireAuth(), getPairs);

// Like a user
router.post("/:userId/likes", requireAuth(), addLike);

// Get messages between two users
router.get("/:palId/messages", requireAuth(), getMessages);

// Get user by id
router.get("/:userId/profile", requireAuth(), getUserById);

// Update Profile
router.patch("/:userId", upload.single("profileImage"), updateProfile);

export const usersRouter = router;
