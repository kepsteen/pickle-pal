import { io, Socket } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
	process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
	messageResponse: (messageData: {
		_id: string;
		sender: string;
		reciever: string;
		content: string;
		timestamp: Date;
	}) => void;
	"pair-swipe-joined": (data: {
		userId: string;
		roomId: string;
		joined: boolean;
	}) => void;
	"pair-swipe-invite-response": (data: {
		inviterId: string;
		inviteeId: string;
		status: "pending" | "accepted" | "declined";
	}) => void;
}

export interface ClientToServerEvents {
	hello: () => void;
	message: (messageData: {
		sender: string | undefined;
		reciever: string;
		content: string;
		timestamp: Date;
	}) => void;
	"join-chat": (data: { userId: string; palId: string }) => void;
	"leave-chat": (data: { userId: string; palId: string }) => void;
	"join-pair-swipe": (data: { userId: string }) => void;
	"pair-swipe-invite": (data: { inviterId: string; inviteeId: string }) => void;
	"pair-swipe-response": (data: {
		inviterId: string;
		inviteeId: string;
		accepted: boolean;
	}) => void;
	"leave-pair-swipe": (data: { userId: string; palId: string }) => void;
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	name: string;
	age: number;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
	io(URL);
