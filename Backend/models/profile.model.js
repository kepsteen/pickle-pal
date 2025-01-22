import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		email: { type: String, required: true },
		firstName: { type: String, required: true },
		userId: { type: String, required: true },
		skillLevel: { type: String },
		playstyle: { type: String },
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
