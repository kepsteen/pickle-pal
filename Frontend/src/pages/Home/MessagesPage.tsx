import { useAuth } from "@clerk/clerk-react";

export default function MessagesPage() {
	const { getToken } = useAuth();

	const fetchMessages = async () => {
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("No token available");
			}

			const response = await fetch("/api/messages", {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(`Request failed: ${errorData}`);
			}

			const data = await response.json();
			console.log("data", data);
		} catch (error) {
			console.error("Error fetching messages:", error);
		}
	};

	return <button onClick={fetchMessages}>Fetch messages</button>;
}
