import express from "express";
import {
	createUser,
	verifyEmailExists,
	updateProfile,
} from "../controllers/user.controllers.js";
const router = express.Router();

// Create Profile
router.post("/", createUser);
router.get("/:email", verifyEmailExists);
router.patch("/:clerkId", updateProfile);

export const usersRouter = router;
