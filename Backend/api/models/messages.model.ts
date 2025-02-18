import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: String,
			ref: "InitialUser",
			required: true,
		},
		reciever: {
			type: String,
			ref: "InitialUser",
			required: true,
		},
		content: { type: String, required: true },
		timestamp: { type: Date, default: Date.now },
	},
	{
		collection: "messages",
		timestamps: true,
	}
);

export default mongoose.model("Message", messageSchema);
