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
				status: "Pending",
			});
		}
	);

	socket.on(
		"pair-swipe-invite-response",
		(data: {
			inviterId: string;
			inviteeId: string;
			status: "Pending" | "Accepted" | "Declined";
		}) => {
			const { inviterId, inviteeId, status } = data;
			const roomId =
				[inviterId, inviteeId].sort().join("_") + "-pair-swipe-session";

			// Broadcast to both users' individual rooms to ensure both receive the update
			const inviterRoom = `${inviterId}-pair-swipe`;
			const inviteeRoom = `${inviteeId}-pair-swipe`;

			io.to(inviterRoom).to(inviteeRoom).emit("pair-swipe-invite-response", {
				inviterId,
				inviteeId,
				status,
			});

			// If accepted, automatically join both users to the session room
			if (status === "Accepted") {
				socket.join(roomId);
				io.to(roomId).emit("pair-swipe-session-ready", {
					inviterId,
					inviteeId,
					roomId,
				});
			}
		}
	);

	socket.on(
		"pair-swipe-action",
		(data: {
			currentUser: {
				userId: string;
				isLiked: boolean | null;
			};
			pairUser: {
				userId: string;
				isLiked: boolean | null;
			};
		}) => {
			const { currentUser, pairUser } = data;
			const roomId =
				[currentUser.userId, pairUser.userId].sort().join("_") +
				"-pair-swipe-session";
			socket.join(roomId);
			io.to(roomId).emit("pair-swipe-action", { currentUser, pairUser });
		}
	);

	socket.on("leave-pair-swipe", (data: { userId: string; palId: string }) => {
		const { userId, palId } = data;
		const userRoomId = `${userId}-pair-swipe`;
		const palRoomId = `${palId}-pair-swipe`;
		socket.leave(userRoomId);
		socket.leave(palRoomId);
		io.to(userRoomId).to(palRoomId).emit("pair-swipe-left", { userId, palId });
	});

	// Todo: Add handler for pair swipe
};
