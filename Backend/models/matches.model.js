import mongoose from "mongoose";

const likesSchema = mongoose.Schema(
	{
		liker: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		liked: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		timestamp: { type: Date, default: Date.now },
	},
	{
		collection: "likes",
		timestamps: true,
	}
);

const Like = mongoose.model("Like", likesSchema);

const matchesSchema = mongoose.Schema(
	{
		user1: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		user2: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
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

const pairsSchema = mongoose.Schema({
	PairUser1: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	PairUser2: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	timestamp: { type: Date, default: Date.now },
});

const Pair = mongoose.model("Pair", pairsSchema);

const pairLikesSchema = mongoose.Schema(
	{
		pairLiker: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Pair",
			required: true,
		},
		pairLiked: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Pair",
			required: true,
		},
		timestamp: { type: Date, default: Date.now },
	},
	{
		collection: "pairLikes",
		timestamps: true,
	}
);

const PairLike = mongoose.model("PairLike", pairLikesSchema);

const pairMatchesSchema = mongoose.Schema(
	{
		pair1Id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Pair",
			required: true,
		},
		pair2Id: {
			type: mongoose.Schema.Types.ObjectId,
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
