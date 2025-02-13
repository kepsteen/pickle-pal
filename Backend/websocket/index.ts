import { Server } from "socket.io";
import http from "http";
import { setupChatHandler } from "./handlers/chatHandler.js";

export const initializeWebSocket = (server: http.Server) => {
	const io = new Server(server, {
		cors: {
			origin: "*", // Configure this according to your needs
			methods: ["GET", "POST"],
		},
	});

	// Set up WebSocket event handlers
	io.on("connection", (socket) => {
		console.log("User connected");

		// Initialize chat handler
		setupChatHandler(io, socket);

		socket.on("disconnect", () => {
			console.log("User disconnected");
		});
	});

	return io;
};
