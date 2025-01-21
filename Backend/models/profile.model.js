import mongoose from "mongoose";

const initialProfileSchema = mongoose.Schema(
	{
		email: { type: String, required: true },
		firstName: { type: String, required: true },
		userId: { type: String, required: true },
		skillLevel: { type: String },
		playstyle: { type: String },
		duprRating: { type: Number, min: 2, max: 8 },
		bio: { type: String },
		lookingFor: {
			casual: {
				type: Boolean,
				default: false,
			},
			competitive: {
				type: Boolean,
				default: false,
			},
			friends: {
				type: Boolean,
				default: false,
			},
			drilling: {
				type: Boolean,
				default: false,
			},
		},
		profileImageUrl: { type: String },
	},
	{
		collection: "users",
	}
);

const InitialProfile = mongoose.model("InitialUser", initialProfileSchema);
export { InitialProfile };
