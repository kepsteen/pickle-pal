import { ProfileData } from "../types/profileSchema";

export async function getUsers(currentUserId: string) {
	// const response = await fetch(`/api/users/all?currentUserId=${currentUserId}`);
	const response = await fetch(`/api/users/all?exclude=${currentUserId}`);
	if (!response.ok) {
		throw new Error("Failed to fetch profiles");
	}
	return (await response.json()) as [ProfileData];
}

export async function setLocation(coordinates: [number]) {
	const response = await fetch("/api");
}
