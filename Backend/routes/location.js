import express from "express";
import { requireAuth } from "@clerk/express";
import {
	setLocation,
	getNearByUsers,
} from "../controllers/location.controllers.js";

const router = express.Router();

router.post("/", requireAuth(), setLocation);
router.get("/nearby-users", requireAuth(), getNearByUsers);

export const locationsRouter = router;
