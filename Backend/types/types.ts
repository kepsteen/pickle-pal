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
