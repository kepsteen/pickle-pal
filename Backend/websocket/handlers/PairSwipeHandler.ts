import { Server, Socket } from "socket.io";

export const setupPairSwipeHandler = (io: Server, socket: Socket) => {
	// Handler for one individual swipe
	socket.on(
		"user-swipe",
		(data: { initiatorId: string; recieverId: string; isLike: boolean }) => {
			io.emit("user-swipe-response", data);
		}
	);

	socket.on("join-pair-swipe", (data: { userId: string }) => {
		const { userId } = data;
		const roomId = `${userId}-pair-swipe`;
		socket.join(roomId);
		io.to(roomId).emit("pair-swipe-joined", { userId, roomId, joined: true });
	});

	socket.on(
		"pair-swipe-invite",
		(data: { inviterId: string; inviteeId: string }) => {
			const { inviterId, inviteeId } = data;
			const roomId = `${inviteeId}-pair-swipe`;
			socket.join(roomId);
			io.to(roomId).emit("pair-swipe-invite-response", {
				inviterId,
				inviteeId,
				status: "pending",
			});
		}
	);

	// Todo: Add handler for pair swipe
};
