import { ProfileData } from "../types/profileSchema";

export async function getUsers(currentUserId: string) {
	// const response = await fetch(`/api/users/all?currentUserId=${currentUserId}`);
	try {
		const response = await fetch(`/api/users/all?exclude=${currentUserId}`);
		if (!response.ok) {
			throw new Error("Failed to fetch profiles");
		}
		return (await response.json()) as ProfileData[];
	} catch (error) {
		console.error("Error fetching users", error);
	}
}

export async function setLocation(
	position: GeolocationPosition,
	token: string
) {
	try {
		const pos = {
			coordinates: [position?.coords.longitude, position?.coords.latitude],
		};
		const response = await fetch("/api/locations", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(pos),
		});
		if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
		return await response.json();
	} catch (error) {
		console.error("Error setting location:", error);
		throw new Error(`Failed to set location`);
	}
}

export async function getNearbyUsers(
	coordinates: number[],
	maxDistance: number,
	token: string | null
) {
	if (token === null || coordinates.length === 0) return [];
	try {
		const response = await fetch(
			`/api/locations/nearby-users?lng=${coordinates[0]}&lat=${coordinates[1]}&maxDistance=${maxDistance}`,
			{
				headers: {
					Authorizartion: `Bearer ${token}`,
				},
			}
		);
		if (!response.ok) throw new Error(`Failed to fetch nearby users`);
		return (await response.json()) as ProfileData[];
	} catch (error) {
		console.error("Error fetching nearby users", error);
	}
}

export async function addLike(
	isLike: boolean,
	likedUserId: string,
	token: string | null
) {
	if (token === null) return;
	try {
		const response = await fetch(`/api/users/${likedUserId}/likes`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ isLike }),
		});
		if (!response.ok) throw new Error(`Failed to add like`);
		return await response.json();
	} catch (error) {
		console.error("Error adding like", error);
	}
}
