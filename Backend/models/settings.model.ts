import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "InitialUser",
			required: true,
		},
		notifications: {
			pushEnabled: { type: Boolean, default: true },
			emailEnabled: { type: Boolean, default: true },
			matchAlerts: { type: Boolean, default: true },
		},
		privacy: {
			showLocation: { type: Boolean, default: true },
			showOnlineStatus: { type: Boolean, default: true },
		},
		preferences: {
			maxDistance: { type: Number, default: 25 }, // in miles
			ageRange: {
				min: { type: Number, default: 18 },
				max: { type: Number, default: 99 },
			},
		},
	},
	{
		collection: "settings",
		timestamps: true,
	}
);

const Settings = mongoose.model("Settings", settingsSchema);
export { Settings };
