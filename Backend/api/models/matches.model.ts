import mongoose from "mongoose";

const likesSchema = new mongoose.Schema(
	{
		liker: {
			type: String,
			ref: "InitialUser",
			required: true,
		},
		liked: {
			type: String,
			ref: "InitialUser",
			required: true,
		},
		isLike: { type: Boolean },
		timestamp: { type: Date, default: Date.now },
	},
	{
		collection: "likes",
		timestamps: true,
	}
);

const Like = mongoose.model("Like", likesSchema);

const matchesSchema = new mongoose.Schema(
	{
		user1: {
			type: String,
			ref: "InitialUser",
			required: true,
		},
		user2: {
			type: String,
			ref: "InitialUser",
			required: true,
		},
		timestamp: { type: Date, default: Date.now },
	},
	{
		collection: "matches",
		timestamps: true,
	}
);

const Match = mongoose.model("Match", matchesSchema);

const pairsSchema = new mongoose.Schema({
	pairUser1: {
		type: String,
		ref: "InitialUser",
		required: true,
	},
	pairUser2: {
		type: String,
		ref: "InitialUser",
		required: true,
	},
	createdAt: { type: Date, default: Date.now },
});

const Pair = mongoose.model("Pair", pairsSchema);

const pairLikesSchema = new mongoose.Schema(
	{
		pairLiker: {
			type: String,
			ref: "Pair",
			required: true,
		},
		pairLiked: {
			type: String,
			ref: "Pair",
			required: true,
		},
		isLike: { type: Boolean },
		timestamp: { type: Date, default: Date.now },
	},
	{
		collection: "pairLikes",
		timestamps: true,
	}
);

const PairLike = mongoose.model("PairLike", pairLikesSchema);

const pairMatchesSchema = new mongoose.Schema(
	{
		pair1Id: {
			type: String,
			ref: "Pair",
			required: true,
		},
		pair2Id: {
			type: String,
			ref: "Pair",
			required: true,
		},
		timestamp: { type: Date, default: Date.now },
	},
	{
		collection: "pairMatches",
		timestamps: true,
	}
);

const PairMatch = mongoose.model("PairMatch", pairMatchesSchema);

export { Like, Match, Pair, PairLike, PairMatch };
