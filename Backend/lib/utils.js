import crypto from "crypto";
export function formatUserImageName(originalname, userId, folder) {
    return "".concat(folder, "/").concat(userId, "/").concat(crypto.randomUUID(), "-").concat(originalname);
}
