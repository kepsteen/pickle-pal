import express from "express";
import { requireAuth } from "@clerk/express";
import {
	setLocation,
	getNearByUsers,
	getNearByPairs,
} from "../controllers/location.controllers.js";

const router = express.Router();

router.post("/", requireAuth(), setLocation);
// router.get("/nearby-users", requireAuth(), getNearByUsers);
router.get("/nearby-users", getNearByUsers);
router.get("/nearby-pairs", getNearByPairs);

export const locationsRouter = router;
