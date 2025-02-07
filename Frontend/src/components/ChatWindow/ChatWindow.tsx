import { useEffect, useState, useRef } from "react";
import { cn } from "../../lib/utils";

import Label from "../Label/Label";
import { Input } from "../Input/Input";
import Button from "../Button/Button";
import { useAuth } from "../../providers/AuthContextProvider";
import { ClientToServerEvents } from "../../socket";
import { Socket } from "socket.io-client";
import { ServerToClientEvents } from "../../socket";
import { Message } from "../../types/user.types";

interface ChatWindowProps {
	palId: string;
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

export default function ChatWindow({ palId, socket }: ChatWindowProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isScrolling, setIsScrolling] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const isFirstRender = useRef(true);
	const [inputMessage, setInputMessage] = useState("");
	const { user } = useAuth();

	useEffect(() => {
		if (isFirstRender.current) {
			scrollToBottom(false);
			isFirstRender.current = false;
		} else {
			scrollToBottom(true);
		}
	}, [messages]);

	useEffect(() => {
		socket.on("messageResponse", (data: Message) => {
			console.log("type of timestamp", typeof data.timestamp);
			setMessages([...messages, data]);
		});
		return () => {
			socket.off("messageResponse");
		};
	}, [socket, messages]);

	const scrollToBottom = (smooth = true) => {
		setIsScrolling(true);
		messagesEndRef.current?.scrollIntoView({
			behavior: smooth ? "smooth" : "auto",
		});

		if (smooth) {
			setTimeout(() => {
				setIsScrolling(false);
			}, 1000);
		} else {
			setIsScrolling(false);
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("message", inputMessage);
		socket.emit("message", {
			sender: user?.id,
			reciever: palId,
			content: inputMessage,
			timestamp: new Date(),
		});
		setInputMessage("");
	};

	return (
		<>
			<div
				className={cn(
					"overflow-y-auto scrollbar-hide",
					// Hide scrollbar during scroll animation
					isScrolling ? "scrollbar-hide" : ""
				)}
			>
				{messages
					.sort((a, b) => {
						const timeA =
							a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
						const timeB =
							b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
						return timeA.getTime() - timeB.getTime();
					})
					.map((message) => (
						<div
							key={new Date(message.timestamp).getTime()}
							className={cn(
								"chat p-2",
								user?.id === message.sender ? "chat-end" : "chat-start"
							)}
						>
							<div
								className={cn(
									"md:text-lg xl:text-2xl max-w-[75%]",
									user?.id === message.sender
										? "chat-bubble chat-bubble-primary"
										: "chat-bubble"
								)}
							>
								{message.content}
							</div>
						</div>
					))}
				<div ref={messagesEndRef} />
			</div>
			<div className="flex items-center gap-2 px-4 py-4 border-t-4 border-t-base-200">
				<form
					onSubmit={handleSubmit}
					className="flex items-center w-full gap-2"
				>
					<Label>
						<Input
							name="message"
							type="text"
							placeholder="Message"
							variant="accent"
							className="border-4 border-base-200"
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
						/>
					</Label>
					<Button type="submit" className="p-1">
						Send
					</Button>
				</form>
			</div>
		</>
	);
}
