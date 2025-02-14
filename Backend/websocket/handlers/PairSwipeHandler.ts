import { Server, Socket } from "socket.io";

export const setupPairSwipeHandler = (io: Server, socket: Socket) => {
	socket.on(
		"join-pair-swipe",
		({ userId, palId }: { userId: string; palId: string }) => {
			const roomId = [userId, palId].sort().join("_") + "-pair-swipe";
			socket.join(roomId);
		}
	);
	// socket.on("pair-swipe-invite", ())

	socket.on(
		"leave-pair-swipe",
		({ userId, palId }: { userId: string; palId: string }) => {
			const roomId = [userId, palId].sort().join("_") + "-pair-swipe";
			socket.leave(roomId);
		}
	);

	// Handler for one individual swipe
	socket.on(
		"user-swipe",
		(data: { initiatorId: string; recieverId: string; isLike: boolean }) => {
			io.emit("user-swipe-response", data);
		}
	);

	// Todo: Add handler for pair swipe
};
