import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: { type: String, required: true },
		firstName: { type: String, required: true },
		userId: { type: String, required: true },
		skillLevel: {
			type: String,
			enum: ["Beginner", "Intermediate", "Advanced"],
		},
		playStyle: { type: String, enum: ["Dinker", "Hybrid", "Banger"] },
		duprRating: { type: Number, min: 2, max: 8 },
		bio: { type: String },
		lookingFor: [{ type: String }],
		profileImageUrl: { type: String },
	},
	{
		collection: "users",
	}
);

const User = mongoose.model("InitialUser", userSchema);
export { User };
