import crypto from "crypto";

export function formatUserImageName(originalname, userId, folder) {
	return `${folder}/${userId}/${crypto.randomUUID()}-${originalname}`;
}
