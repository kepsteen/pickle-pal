import { DEFAULT_EXPIRATION, redis } from "./client.js";
import { PairSwipeSession } from "../types/types.js";

export const pairSwipeSessionManager = {
	async saveSession(userId: string, session: PairSwipeSession) {
		await redis.setEx(
			`${userId}-pair-swipe-session`,
			DEFAULT_EXPIRATION,
			JSON.stringify(session)
		);
	},
	async getSession(userId: string) {
		const session = await redis.get(`${userId}-pair-swipe-session`);
		return session ? JSON.parse(session) : null;
	},
};
