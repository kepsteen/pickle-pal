import { createClient } from "redis";

const DEFAULT_EXPIRATION = 3600;

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

export const connectRedis = async () => {
	await client.connect();
};

export const redis = client;

export const getOrSetCache = async <T>(
	key: string,
	callback: () => Promise<T>
) => {
	try {
		const data = await redis.get(key);
		if (data != null) {
			return JSON.parse(data) as T;
		}

		const freshData = await callback();
		await redis.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
		return freshData;
	} catch (error) {
		throw error;
	}
};
