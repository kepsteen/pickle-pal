import { useEffect, useState, useRef } from "react";
import { cn } from "../../lib/utils";

type Message = {
	sender: string;
	reciever: string;
	content: string;
	timestamp: Date;
};

const messagesData: Message[] = [
	{
		sender: "65a123456789abcdef123456",
		reciever: "65a123456789abcdef123457",
		content: "Hello, how are you?",
		timestamp: new Date("2024-01-12T10:00:00Z"),
	},
	{
		sender: "65a123456789abcdef123457",
		reciever: "65a123456789abcdef123456",
		content: "I'm doing well, thanks! How about you?",
		timestamp: new Date("2024-01-12T10:01:00Z"),
	},
	{
		sender: "65a123456789abcdef123456",
		reciever: "65a123456789abcdef123457",
		content: "Great! Just working on some code.",
		timestamp: new Date("2024-01-12T10:02:00Z"),
	},
	{
		sender: "65a123456789abcdef123457",
		reciever: "65a123456789abcdef123456",
		content: "Oh nice! What are you working on?",
		timestamp: new Date("2024-01-12T10:03:00Z"),
	},
	{
		sender: "65a123456789abcdef123456",
		reciever: "65a123456789abcdef123457",
		content: "Building a chat application with React",
		timestamp: new Date("2024-01-12T10:04:00Z"),
	},
	{
		sender: "65a123456789abcdef123457",
		reciever: "65a123456789abcdef123456",
		content: "That sounds interesting! How's it going so far?",
		timestamp: new Date("2024-01-12T10:05:00Z"),
	},
	{
		sender: "65a123456789abcdef123456",
		reciever: "65a123456789abcdef123457",
		content: "Pretty good! Just implementing the message display now",
		timestamp: new Date("2024-01-12T10:06:00Z"),
	},
	{
		sender: "65a123456789abcdef123457",
		reciever: "65a123456789abcdef123456",
		content: "Are you using any specific UI libraries?",
		timestamp: new Date("2024-01-12T10:07:00Z"),
	},
	{
		sender: "65a123456789abcdef123456",
		reciever: "65a123456789abcdef123457",
		content: "Yes, I'm using DaisyUI with Tailwind",
		timestamp: new Date("2024-01-12T10:08:00Z"),
	},
	{
		sender: "65a123456789abcdef123457",
		reciever: "65a123456789abcdef123456",
		content: "That's a great combination! I've used it before",
		timestamp: new Date("2024-01-12T10:09:00Z"),
	},
	{
		sender: "65a123456789abcdef123456",
		reciever: "65a123456789abcdef123457",
		content: "Yeah, it makes styling so much easier",
		timestamp: new Date("2024-01-12T10:10:00Z"),
	},
	{
		sender: "65a123456789abcdef123457",
		reciever: "65a123456789abcdef123456",
		content: "Are you planning to add any real-time features?",
		timestamp: new Date("2024-01-12T10:11:00Z"),
	},
	{
		sender: "65a123456789abcdef123456",
		reciever: "65a123456789abcdef123457",
		content: "Yes, I'll probably use Socket.IO for that",
		timestamp: new Date("2024-01-12T10:12:00Z"),
	},
	{
		sender: "65a123456789abcdef123457",
		reciever: "65a123456789abcdef123456",
		content: "Good choice! Socket.IO is really reliable",
		timestamp: new Date("2024-01-12T10:13:00Z"),
	},
	{
		sender: "65a123456789abcdef123456",
		reciever: "65a123456789abcdef123457",
		content: "Have you worked with it before?",
		timestamp: new Date("2024-01-12T10:14:00Z"),
	},
	{
		sender: "65a123456789abcdef123457",
		reciever: "65a123456789abcdef123456",
		content: "Yes, on a few projects. It's pretty straightforward",
		timestamp: new Date("2024-01-12T10:15:00Z"),
	},
	{
		sender: "65a123456789abcdef123456",
		reciever: "65a123456789abcdef123457",
		content: "That's good to hear! Any tips?",
		timestamp: new Date("2024-01-12T10:16:00Z"),
	},
	{
		sender: "65a123456789abcdef123457",
		reciever: "65a123456789abcdef123456",
		content: "Make sure to handle disconnections properly",
		timestamp: new Date("2024-01-12T10:17:00Z"),
	},
	{
		sender: "65a123456789abcdef123456",
		reciever: "65a123456789abcdef123457",
		content: "Thanks, I'll keep that in mind!",
		timestamp: new Date("2024-01-12T10:18:00Z"),
	},
	{
		sender: "65a123456789abcdef123457",
		reciever: "65a123456789abcdef123456",
		content: "No problem! Let me know if you need any help",
		timestamp: new Date("2024-01-12T10:19:00Z"),
	},
	{
		sender: "65a123456789abcdef123456",
		reciever: "65a123456789abcdef123457",
		content: "Will do, thanks!",
		timestamp: new Date("2024-01-12T10:20:00Z"),
	},
	{
		sender: "65a123456789abcdef123457",
		reciever: "65a123456789abcdef123456",
		content: "Good luck with the project!",
		timestamp: new Date("2024-01-12T10:21:00Z"),
	},
];

const userId = "65a123456789abcdef123456";

export default function ChatWindow() {
	const [messages, setMessages] = useState<Message[]>([...messagesData]);
	// Add state to track scrolling
	const [isScrolling, setIsScrolling] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		setIsScrolling(true);
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		// Reset scrolling state after animation completes
		setTimeout(() => {
			setIsScrolling(false);
		}, 1000); // 1000ms matches the default smooth scroll duration
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<>
			<div
				className={cn(
					"w-1/2 overflow-y-auto h-96",
					// Hide scrollbar during scroll animation
					isScrolling ? "scrollbar-hide" : ""
				)}
			>
				{messages
					.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
					.map((message) => (
						<div
							key={message.timestamp.getTime()}
							className={cn(
								"chat p-2",
								userId === message.sender ? "chat-end" : "chat-start"
							)}
						>
							<div
								className={cn(
									userId === message.sender
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
			<button
				onClick={() =>
					setMessages([
						...messages,
						{
							sender: userId,
							reciever: "65a123456789abcdef123457",
							content: "Hello, how are you?",
							timestamp: new Date(),
						},
					])
				}
			>
				Add Message
			</button>
		</>
	);
}
