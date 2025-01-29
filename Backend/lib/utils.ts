import crypto from "crypto";

export function formatUserImageName(
	originalname: string,
	userId: string,
	folder: string
) {
	return `${folder}/${userId}/${crypto.randomUUID()}-${originalname}`;
}
