import { GetToken } from "@clerk/types";
import {
	Message,
	PairData,
	PairSwipeSession,
	ProfileData,
} from "../types/user.types";
import { AddLikeResponse } from "../types/user.types";

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

export async function getLocation(token: string) {
	try {
		const response = await fetch("/api/locations", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
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
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (!response.ok) throw new Error(`Failed to fetch nearby users`);
		return (await response.json()) as ProfileData[];
	} catch (error) {
		console.error("Error fetching nearby users", error);
	}
}

export const addLike = async (
	userId: string,
	isLike: boolean,
	token: string | null
): Promise<AddLikeResponse | undefined> => {
	if (token === null) return;
	try {
		const response = await fetch(`/api/users/${userId}/likes`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ isLike }),
		});

		if (!response.ok) {
			throw new Error("Failed to add like");
		}

		return await response.json();
	} catch (error) {
		console.error("Error adding like:", error);
		throw error; // Re-throw the error so the calling component can handle it
	}
};

export async function getPals(token: string | null) {
	if (token === null) return [];
	try {
		const response = await fetch("/api/users/pals", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) throw new Error("Failed to fetch pals");
		return (await response.json()) as ProfileData[];
	} catch (error) {
		console.error("Error fetching pals:", error);
	}
}

export async function getMessages(token: string | null, palId: string) {
	if (token === null) return [];
	try {
		const response = await fetch(`/api/users/${palId}/messages`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) throw new Error("Failed to fetch messages");
		return (await response.json()) as Message[];
	} catch (error) {
		console.error("Error fetching messages:", error);
	}
}

export async function getUserById(
	userId: string | undefined,
	getToken: GetToken
) {
	const token = await getToken();
	if (token === null || userId === undefined) return;
	try {
		const response = await fetch(`/api/users/${userId}/profile`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) throw new Error("Failed to fetch user");
		return (await response.json()) as ProfileData;
	} catch (error) {
		console.error("Error fetching user by id:", error);
	}
}

export async function getCurrentPair(
	userId: string | undefined,
	palId: string | undefined,
	token: string | null
): Promise<PairData | null> {
	if (token === null) return null;
	try {
		const response = await fetch(
			`/api/users/current-pair?userId=${userId}&palId=${palId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (!response.ok) throw new Error("Failed to fetch current pair");
		return (await response.json()) as PairData;
	} catch (error) {
		console.error("Error fetching current pair:", error);
		return null;
	}
}

export async function getPairs(token: string | null, pairId: string | null) {
	if (token === null) return [];
	try {
		const response = await fetch(`/api/users/pairs?pairId=${pairId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) throw new Error("Failed to fetch pairs");
		return (await response.json()) as PairData[];
	} catch (error) {
		console.error("Error fetching pairs:", error);
	}
}

export async function savePairSwipeSession(
	token: string | null,
	sessionData: PairSwipeSession
) {
	if (token === null) return;
	try {
		const response = await fetch("/api/users/pair-swipe-session", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(sessionData),
		});
		if (!response.ok) throw new Error("Failed to save pair swipe session");
		return await response.json();
	} catch (error) {
		console.error("Error saving pair swipe session:", error);
	}
}

export async function getPairSwipeSession(token: string | null) {
	if (token === null) return;
	try {
		const response = await fetch("/api/users/pair-swipe-session", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!response.ok) throw new Error("Failed to fetch pair swipe session");
		return (await response.json()) as PairSwipeSession;
	} catch (error) {
		console.error("Error fetching pair swipe session:", error);
	}
}
