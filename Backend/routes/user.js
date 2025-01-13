import express from "express";
import {
	createUser,
	verifyEmailExists,
} from "../controllers/user.controllers.js";
const router = express.Router();

// Create Profile
router.post("/", createUser);
router.get("/:email", verifyEmailExists);

export const usersRouter = router;
