import { z } from "zod";

export const profileSchema = z.object({
	firstName: z.string().min(1, "Name is required"),
	skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
	playStyle: z.enum(["Dinker", "Hybrid", "Banger"]),
	lookingFor: z.object({
		competitive: z.coerce.boolean(),
		casual: z.coerce.boolean(),
		friends: z.boolean(),
		drilling: z.boolean(),
	}),
	duprRating: z.coerce
		.number()
		.min(2.0, "DUPR Rating must be between 2 and 8")
		.max(8.0, "DUPR Rating must be between 2 and 8"),
	bio: z.string().min(1, "Bio is required").max(500),
	profileImage: z.instanceof(FileList).refine((files) => files.length > 0, {
		message: "Profile image is required",
	}),
	profileImageUrl: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export type ProfileData = {
	userId: string;
	firstName: string;
	skillLevel: "Beginner" | "Intermediate" | "Advanced";
	playStyle: "Dinker" | "Hybrid" | "Banger";
	lookingFor: [string];
	duprRating: number;
	bio: string;
	profileImageUrl: string;
};

export interface User {
	userId: string;
	email: string;
	firstName: string;
	skillLevel?: string;
	playStyle?: string;
	duprRating?: number;
	bio?: string;
	lookingFor?: string[];
	profileImageUrl?: string;
}

export interface AddLikeResponse {
	like: {
		liker: string;
		liked: string;
		isLike: boolean;
	};
	isMatch: boolean;
	matchedUser: User | null;
}
