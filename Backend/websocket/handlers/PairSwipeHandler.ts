import { Server, Socket } from "socket.io";

export const setupPairSwipeHandler = (io: Server, socket: Socket) => {
	// Handler for one individual swipe
	socket.on(
		"user-swipe",
		(data: { initiatorId: string; recieverId: string; isLike: boolean }) => {
			io.emit("user-swipe-response", data);
		}
	);

	// Todo: Add handler for pair swipe
};
