import mongoose from "mongoose";

const locationsSchema = mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
			ref: "InitialUser",
		},
		location: {
			type: {
				type: String,
				enum: ["Point"],
				required: true,
			},
			coordinates: {
				type: [Number], // [longitude, latitude]
				required: true,
			},
		},
		lastUpdated: {
			type: Date,
			default: Date.now,
		},
	},
	{
		collection: "locations",
	}
);

// Create a 2dsphere index for geospatial queries
locationsSchema.index({ location: "2dsphere" });

const Location = mongoose.model("Location", locationsSchema);
export { Location };
