import { Server, Socket } from "socket.io";
import { PairLike, PairMatch } from "../../api/models/matches.model.js";

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

	socket.on(
		"pair-swipe-like",
		async (data: {
			pairLikerId: string;
			pairLikedId: string;
			isLiked: boolean;
			pairLikerUser1Id: string;
			pairLikerUser2Id: string;
		}) => {
			console.log("pair-swipe-like", data);
			try {
				const {
					pairLikerId,
					pairLikedId,
					isLiked,
					pairLikerUser1Id,
					pairLikerUser2Id,
				} = data;
				const roomId =
					[pairLikerUser1Id, pairLikerUser2Id].sort().join("_") +
					"-pair-swipe-session";
				socket.join(roomId);
				const pairLike = await PairLike.create({
					pairLiker: pairLikerId,
					pairLiked: pairLikedId,
					isLike: isLiked,
				});

				// check for a match
				const pairMatch = await PairLike.findOne({
					pairLiker: pairLikedId,
					pairLiked: pairLikerId,
					isLike: true,
				});

				if (pairMatch) {
					await PairMatch.create({
						pair1Id: pairLikerId,
						pair2Id: pairLikedId,
					});
				}

				io.to(roomId).emit("pair-swipe-like", {
					pairLikerId,
					pairLikedId,
					isLiked,
				});
			} catch (error) {
				console.error("Error adding pair like", error);
			}
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
