import express, { Router } from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";
import { usersRouter } from "./routes/user.js";
import cors from "cors";
import { connectDB } from "./db/connect.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(cors());

app.use(express.json());

// Serve static files from the Frontend/dist directory
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use("/api/users", usersRouter);

// Serve index.html for all other routes (for client-side routing)
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

connectDB().then(() => {
	app.listen(port, "0.0.0.0", () =>
		console.log(`Server running on port ${port}`)
	);
});
