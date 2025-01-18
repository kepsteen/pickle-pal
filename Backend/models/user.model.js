import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		email: { type: String, required: true },
		firstName: { type: String, required: true },
		skillLevel: {  type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] ,required: true},
		playStyle: { type: String, enum: ['Dinker', 'Hybrid', 'Banger'], required: true },
		lookingFor: {
			casual: {
				type: Boolean,
				default: false
			},
			competitive: {
				type: Boolean,
				default: false
			},
			friends: {
				type: Boolean,
				default: false
			},
			drilling: {
				type: Boolean,
				default: false
			},
			
		},
		bio: { type: String, required: false },
		profileImage: { type: String, required: false},
		duprRating: { type: Number, min: 2, max: 8, required: false }
	},
	{
		collection: "users",
	}
);

export default mongoose.model("User", userSchema);
