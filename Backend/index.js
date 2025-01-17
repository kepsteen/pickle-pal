import express, { Router } from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";
import { usersRouter } from "./routes/user.js";
import cors from "cors";
import { connectDB } from "./db/connect.js";

const app = express();
const port = 3000;

// Middleware
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use("/api/users", usersRouter);

connectDB().then(() => {
	app.listen(port, "0.0.0.0", () =>
		console.log(`Server running on port ${port}`)
	);
});
