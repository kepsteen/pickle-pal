import { useEffect, useState } from "react";
import io from "socket.io-client";

interface Message {
	content: string;
	recieverId: string;
}

export default function TestSocketIO() {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const socket = io("http://localhost:3000");

	useEffect(() => {
		socket.on("message", (data) => {
			console.log("Received from server:", data);
			setMessages((prevMessages) => [...prevMessages, data]);
		});

		return () => {
			socket.off("message");
		};
	}, [socket]);

	function handleClick() {
		// Create random sender for testing purposes
		const randomNumber = Math.random();
		const userId =
			randomNumber > 0.5
				? "user_2rgLaUCcJmigG45v2SAn89Bex9O"
				: "user_2sN3AY3EMx4ZhodA3S2J5Txu9C7";
		const recieverId =
			randomNumber < 5
				? "user_2rgLaUCcJmigG45v2SAn89Bex9O"
				: "user_2sN3AY3EMx4ZhodA3S2J5Txu9C7";
		const messageData = {
			id: userId,
			content: message,
			recieverId: recieverId,
		};
		socket.emit("message", messageData);
		console.log("Message sent to server");
		setMessage("");
	}

	return (
		<div>
			<input
				className="input"
				type="text"
				onChange={(e) => setMessage(e.target.value)}
				value={message}
			/>
			<button onClick={handleClick}>Send Message</button>
			<div>
				{messages.map((message, index) => (
					<div key={index}>{message?.content}</div>
				))}
			</div>
		</div>
	);
}
