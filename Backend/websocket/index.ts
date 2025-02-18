import { Server } from "socket.io";
import http from "http";
import { setupChatHandler } from "./handlers/chatHandler.js";
import { setupPairSwipeHandler } from "./handlers/PairSwipeHandler.js";

export const initializeWebSocket = (server: http.Server) => {
	const io = new Server(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	// Set up WebSocket event handlers
	io.on("connection", (socket) => {
		console.log("User connected");

		// Initialize chat handler
		setupChatHandler(io, socket);

		// Initialize pair swipe handler
		setupPairSwipeHandler(io, socket);

		socket.on("disconnect", () => {
			console.log("User disconnected");
		});
	});

	return io;
};
