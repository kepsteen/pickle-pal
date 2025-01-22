export async function getUsers(currentUserId: string) {
	// const response = await fetch(`/api/users/all?currentUserId=${currentUserId}`);
	console.log("currentUserId", currentUserId);
	const response = await fetch(`/api/users/all`);
	if (!response.ok) {
		throw new Error("Failed to fetch profiles");
	}
	return response.json();
}
