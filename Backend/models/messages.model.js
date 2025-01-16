import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		reciever: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
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
