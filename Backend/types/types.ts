export interface LocationDocument {
	userId: string;
	location: {
		type: "Point";
		coordinates: [number, number];
	};
}

export interface InitialUserDocument {
	userId: string;
}

export interface UserDocument {
	userId: string;
	firstName: string;
	email: string;
	skillLevel?: "Beginner" | "Intermediate" | "Advanced";
	playStyle?: "Dinker" | "Hybrid" | "Banger";
	duprRating?: number;
	bio?: string;
	lookingFor?: string[];
	profileImageUrl?: string;
}

export interface User {
	userId: string;
	email: string;
	firstName: string;
	skillLevel?: string;
	playStyle?: string;
	duprRating?: number;
	bio?: string;
	lookingFor?: string[];
	profileImageUrl?: string;
}

export interface AddLikeResponse {
	like: {
		liker: string;
		liked: string;
		isLike: boolean;
	};
	isMatch: boolean;
	matchedUser: User | null;
}
