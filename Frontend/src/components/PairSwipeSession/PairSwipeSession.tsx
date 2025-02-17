import { Card, CardContent } from "../Card/Card";
import { Avatar } from "../Avatar/Avatar";
import SwipeIndicator from "../SwipeIndicator/SwipeIndicator";
import PairPalCard from "../PairPalCard.tsx/PairPalCard";
import SwipeButton from "../SwipeButton/SwipeButton";
import Button from "../Button/Button";
import { ProfileData } from "../../types/user.types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../lib/api";
import { ClientToServerEvents, ServerToClientEvents } from "../../socket";
import { Socket } from "socket.io-client";

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
	userId: string | undefined;
	isLiked: boolean | null;
};

type PairSwipeLikes = {
	currentUser: UserLike;
	pairUser: UserLike;
};

interface PairSwipeSessionProps {
	pairIds: {
		currentUser: string | undefined;
		pairUser: string | undefined;
	};
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	setPageState: (pageState: "initial" | "invited" | "session joined") => void;
}

export default function PairSwipeSession({
	pairIds,
	socket,
	setPageState,
}: PairSwipeSessionProps) {
	const [profiles] = useState<ProfileData[][]>([profileData]);
	const [likes, setLikes] = useState<PairSwipeLikes>({
		currentUser: { userId: pairIds.currentUser, isLiked: null },
		pairUser: { userId: pairIds.pairUser, isLiked: null },
	});
	const { user } = useUser();

	useEffect(() => {
		socket.on("pair-swipe-action", (data) => {
			// Only update if the action was performed by the pair user
			if (data.currentUser.userId !== user?.id) {
				setLikes((prev) => ({
					...prev,
					pairUser: {
						userId: data.currentUser.userId,
						isLiked: data.currentUser.isLiked,
					},
				}));
			}
		});
		socket.on("pair-swipe-left", () => {
			setPageState("initial");
		});

		return () => {
			socket.off("pair-swipe-action");
			socket.off("pair-swipe-left");
		};
	}, [socket, user?.id, setPageState]);

	const { getToken } = useAuth();

	const { data, isLoading, error } = useQuery({
		queryKey: ["users", pairIds.currentUser, pairIds.pairUser],
		queryFn: async () => {
			const [currentUserData, pairUserData] = await Promise.all([
				getUserById(pairIds.currentUser, getToken),
				getUserById(pairIds.pairUser, getToken),
			]);
			return { currentUserData, pairUserData };
		},
		enabled: !!pairIds.currentUser && !!pairIds.pairUser,
	});

	const handleSwipe = (direction: "left" | "right") => {
		const isLiked = direction === "right" ? true : false;
		setLikes((prev) => ({
			...prev,
			currentUser: {
				userId: user?.id ?? "",
				isLiked,
			},
		}));
		socket.emit("pair-swipe-action", {
			currentUser: {
				userId: user?.id ?? "",
				isLiked,
			},
			pairUser: {
				userId: likes.pairUser.userId ?? "",
				isLiked: likes.pairUser.isLiked,
			},
		});
	};

	const handleLeaveSession = () => {
		socket.emit("leave-pair-swipe", {
			userId: user?.id ?? "",
			palId: pairIds.pairUser ?? "",
		});
		setPageState("initial");
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<section>
			<div className="flex items-center justify-center gap-4">
				{/* {"Current User Avatar"} */}
				<Avatar imageUrl={data?.currentUserData?.profileImageUrl ?? ""} />
				<Card className="bg-base-200">
					<CardContent className="flex flex-row items-center justify-center gap-4 p-3">
						{/* Add a container div with fixed dimensions */}
						<div className="relative flex gap-4">
							<SwipeIndicator
								userId={likes.currentUser.userId}
								isLiked={likes.currentUser.isLiked}
							/>
							<SwipeIndicator
								userId={likes.pairUser.userId}
								isLiked={likes.pairUser.isLiked}
							/>
						</div>
					</CardContent>
				</Card>
				{/* {"Pair User Avatar"} */}
				<Avatar imageUrl={data?.pairUserData?.profileImageUrl ?? ""} />
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
				<Button variant="error" className="mt-4" onClick={handleLeaveSession}>
					Leave Session
				</Button>
			</div>
		</section>
	);
}
