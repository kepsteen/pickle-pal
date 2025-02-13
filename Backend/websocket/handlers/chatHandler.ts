import { Server, Socket } from "socket.io";
import Message from "../../api/models/messages.model.js";

export const setupChatHandler = (io: Server, socket: Socket) => {
	socket.on(
		"join-chat",
		({ userId, palId }: { userId: string; palId: string }) => {
			const roomId = [userId, palId].sort().join("_") + "-chat";
			socket.join(roomId);
		}
	);

	socket.on(
		"leave-chat",
		({ userId, palId }: { userId: string; palId: string }) => {
			const roomId = [userId, palId].sort().join("_") + "-chat";
			socket.leave(roomId);
		}
	);

	socket.on(
		"message",
		async (data: { sender: string; reciever: string; content: string }) => {
			try {
				const message = await Message.create({
					sender: data.sender,
					reciever: data.reciever,
					content: data.content,
				});
				// Add chat message to the database
				io.emit("messageResponse", data);
			} catch (error) {
				console.error("Error creating message:", error);
			}
		}
	);
};
