import { z } from "zod";

export const profileSchema = z.object({
	firstName: z.string().min(1, "Name is required"),
	skillLevel: z.enum(["beginner", "intermediate", "Advanced"]),
	playStyle: z.enum(["dinker", "hybrid", "banger"]),
	lookingFor: z.object({
		competitive: z.coerce.boolean(),
		casual: z.coerce.boolean(),
		friends: z.boolean(),
		drilling: z.boolean(),
	}),
	duprRating: z.coerce.number().min(2.0).max(7.0),
	bio: z.string().max(500).optional(),
	profileImage: z.instanceof(FileList),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
