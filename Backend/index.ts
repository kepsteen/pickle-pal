import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";
import { usersRouter } from "./routes/user.js";
import cors from "cors";
import { connectDB } from "./db/connect.js";
import path from "path";
import { fileURLToPath } from "url";
import { clerkMiddleware, requireAuth, AuthObject } from "@clerk/express";
import { locationsRouter } from "./routes/location.js";
import { Server } from "socket.io";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*", // Configure this according to your needs
		methods: ["GET", "POST"],
	},
});

// Middleware
app.use(cors());

app.use(express.json());

app.use(
	clerkMiddleware({
		secretKey: process.env.CLERK_SECRET_KEY,
		publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
	})
);

// Serve static files from the Frontend/dist directory
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use("/api/users", usersRouter);

app.use("/api/locations", locationsRouter);

app.get(
	"/api/test-auth-middleware",
	requireAuth(),
	async (req: Request, res: Response) => {
		try {
			const { userId } = req.auth;
			console.log("userId", userId);
			res.status(200).json({ userId });
		} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
);

// Socket.IO connection handling
io.on("connection", (socket) => {
	console.log("A user connected");

	socket.on("disconnect", () => {
		console.log("User disconnected");
	});

	// Add your custom socket events here
	// Example:
	socket.on("message", (data) => {
		// Handle message
		io.emit("message", data); // Broadcast to all connected clients
	});
});

// Serve index.html for all other routes (for client-side routing)
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

connectDB().then(() => {
	server.listen(port, "0.0.0.0", () =>
		console.log(`Server running on port ${port}`)
	);
});
