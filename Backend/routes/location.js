import express from "express";
import { requireAuth } from "@clerk/express";
import { setLocation } from "../controllers/location.controllers.js";

const router = express.Router();

router.post("/", requireAuth(), setLocation);

export const locationsRouter = router;
