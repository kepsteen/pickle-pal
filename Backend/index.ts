import express, { Request, Response } from "express";
import "dotenv/config";
import { usersRouter } from "./api/routes/user.js";
import cors from "cors";
import { connectDB } from "./db/connect.js";
import path from "path";
import { fileURLToPath } from "url";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { locationsRouter } from "./api/routes/location.js";
import http from "http";
import { initializeWebSocket } from "./websocket/index.js";
import { connectRedis, getOrSetCache, redis } from "./redis/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reactStaticDir = new URL("../Frontend/public/dist", import.meta.url)
	.pathname;

const app = express();
const port = 3000;
const server = http.createServer(app);

// Initialize WebSocket
const io = initializeWebSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(
	clerkMiddleware({
		secretKey: process.env.CLERK_SECRET_KEY,
		publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
	})
);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

// API routes
app.use("/api/users", usersRouter);
app.use("/api/locations", locationsRouter);

app.get(
	"/api/test-auth-middleware",
	requireAuth(),
	async (req: Request, res: Response) => {
		try {
			const { userId } = req.auth;
			res.status(200).json({ userId });
		} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
);

app.get(
	"/api/test-redis/pokemon/:name",
	async (req: Request, res: Response) => {
		try {
			const { name } = req.params;
			const pokemon = await getOrSetCache(`pokemon:${name}`, async () => {
				const response = await fetch(
					`https://pokeapi.co/api/v2/pokemon/${name}`
				);
				return await response.json();
			});
			res.status(200).json(pokemon);
		} catch (error) {
			console.error("Redis error:", error);
			res.status(500).json({ error: "Redis operation failed" });
		}
	}
);

// Catch-all route for SPA - should be after API routes
app.get("*", (req, res) => {
	res.sendFile(path.join(`${reactStaticDir}/index.html`));
});

connectDB()
	.then(() => connectRedis())
	.then(() => {
		server.listen(port, "0.0.0.0", () =>
			console.log(`Server running on port ${port}`)
		);
	})
	.catch((error) => {
		console.error("Failed to connect to services:", error);
		process.exit(1);
	});
