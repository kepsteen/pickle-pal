import express from "express";
import { requireAuth } from "@clerk/express";
import {
	setLocation,
	getNearByUsers,
	getNearByPairs,
	getLocation,
} from "../controllers/location.controllers.js";

const router = express.Router();

router.post("/", requireAuth(), setLocation);
router.get("/", requireAuth(), getLocation);
// router.get("/nearby-users", requireAuth(), getNearByUsers);
router.get("/nearby-users", requireAuth(), getNearByUsers);
router.get("/nearby-pairs", requireAuth(), getNearByPairs);

export const locationsRouter = router;
