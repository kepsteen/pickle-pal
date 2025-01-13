import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		email: { type: String, required: true },
		firstName: { type: String, required: true },
	},
	{
		collection: "users",
	}
);

export default mongoose.model("User", userSchema);
