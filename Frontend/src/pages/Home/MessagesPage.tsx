import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { MatchToast } from "../../components/Toast/Toast";

export default function MessagesPage() {
	const { getToken } = useAuth();

	const testAuthMiddleware = async () => {
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("No token available");
			}

			const response = await fetch("/api/test-auth-middleware", {
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

	return (
		<>
			<button onClick={testAuthMiddleware}>Fetch messages</button>
			<button onClick={() => toast(<MatchToast name="John" />)}>Toast</button>
		</>
	);
}
