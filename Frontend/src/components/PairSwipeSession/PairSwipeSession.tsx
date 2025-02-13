import { Card, CardContent } from "../Card/Card";
import { Avatar } from "../Avatar/Avatar";
import SwipeIndicator from "../SwipeIndicator/SwipeIndicator";
import PairPalCard from "../PairPalCard.tsx/PairPalCard";
import SwipeButton from "../SwipeButton/SwipeButton";
import Button from "../Button/Button";
import { ProfileData } from "../../types/user.types";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

const profileData: ProfileData[] = [
	{
		userId: "1",
		firstName: "John",
		skillLevel: "Beginner",
		playStyle: "Dinker",
		lookingFor: ["competitive", "friends", "drilling"],
		duprRating: 4.5,
		bio: "I'm a dinker who loves to play tennis",
		profileImageUrl:
			"https://nypost.com/wp-content/uploads/sites/2/2023/07/John-McEnroe.jpg",
	},
	{
		userId: "2",
		firstName: "Jane",
		skillLevel: "Intermediate",
		playStyle: "Dinker",
		lookingFor: ["competitive", "friends", "drilling"],
		duprRating: 4.5,
		bio: "I'm a dinker who loves to play tennis",
		profileImageUrl:
			"https://www.pickleball.cafe/img/people/profile-photos/catherine-parenteau.webp?1676757286",
	},
];

type UserLike = {
	userId: string;
	isLiked: boolean | null;
};

type PairSwipeLikes = {
	currentUser: UserLike;
	otherUser: UserLike;
};

export default function PairSwipeSession() {
	const [profiles] = useState<ProfileData[][]>([profileData]);
	const [likes, setLikes] = useState<PairSwipeLikes>({
		currentUser: { userId: "user_2ryFwgZm2ynw3BDrhNA5Pyz8B1d", isLiked: null },
		otherUser: { userId: "user_2sN3AY3EMx4ZhodA3S2J5Txu9C7", isLiked: null },
	});

	const { user } = useUser();

	const handleSwipe = (direction: "left" | "right") => {
		const isLiked = direction === "right" ? true : false;
		setLikes((prev) => ({
			...prev,
			currentUser: {
				userId: user?.id ?? prev.currentUser.userId,
				isLiked,
			},
		}));
	};

	return (
		<section>
			<div className="flex items-center justify-center gap-4">
				{/* {"Current User Avatar"} */}
				<Avatar />
				<Card className="bg-base-200">
					<CardContent className="flex flex-row items-center justify-center gap-4 p-3">
						{/* Add a container div with fixed dimensions */}
						<div className="relative flex gap-4">
							<SwipeIndicator
								userId={likes.currentUser.userId}
								isLiked={likes.currentUser.isLiked}
							/>
							<SwipeIndicator
								userId={likes.otherUser.userId}
								isLiked={likes.otherUser.isLiked}
							/>
						</div>
					</CardContent>
				</Card>
				{/* {"Other User Avatar"} */}
				<Avatar />
			</div>
			<div className="grid mt-10 place-content-center">
				{profiles && profiles[0] && (
					<PairPalCard profiles={profiles[0]} swipeDirection={"left"} />
				)}
			</div>
			{profiles && profiles.length !== 0 && (
				<div className="flex justify-center gap-8 mt-8">
					<SwipeButton
						variant="dislike"
						onClick={() => handleSwipe("left")}
						disabled={likes.currentUser.isLiked !== null}
					/>
					<SwipeButton
						variant="like"
						onClick={() => handleSwipe("right")}
						disabled={likes.currentUser.isLiked !== null}
					/>
				</div>
			)}
			<div className="flex justify-center">
				<Button variant="error" className="mt-4">
					Leave Session
				</Button>
			</div>
		</section>
	);
}
