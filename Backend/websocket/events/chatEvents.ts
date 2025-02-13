export interface ChatMessage {
	sender: string;
	reciever: string;
	content: string;
}

export interface ChatRoomParams {
	userId: string;
	palId: string;
}

export interface ServerToClientEvents {
	messageResponse: (data: ChatMessage) => void;
}

export interface ClientToServerEvents {
	"join-chat": (data: ChatRoomParams) => void;
	"leave-chat": (data: ChatRoomParams) => void;
	message: (data: ChatMessage) => void;
}
