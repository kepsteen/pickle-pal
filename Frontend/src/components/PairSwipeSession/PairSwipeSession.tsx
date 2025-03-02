import { Card, CardContent } from "../Card/Card";
import { Avatar } from "../Avatar/Avatar";
import SwipeIndicator from "../SwipeIndicator/SwipeIndicator";
import PairPalCard from "../PairPalCard.tsx/PairPalCard";
import SwipeButton from "../SwipeButton/SwipeButton";
import Button from "../Button/Button";
import { PairData, ProfileData } from "../../types/user.types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPairs } from "../../lib/api";
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
	currentPairData: PairData | null;
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	setPageState: (pageState: "initial" | "invited" | "session joined") => void;
}

export default function PairSwipeSession({
	pairIds,
	currentPairData,
	socket,
	setPageState,
}: PairSwipeSessionProps) {
	const [profiles] = useState<ProfileData[][]>([profileData]);
	const [likes, setLikes] = useState<PairSwipeLikes>({
		currentUser: { userId: pairIds.currentUser, isLiked: null },
		pairUser: { userId: pairIds.pairUser, isLiked: null },
	});
	const [pairProfiles, setPairProfiles] = useState<PairData[]>([]);
	const [swipeDirection, setSwipeDirection] = useState<"left" | "right">(
		"left"
	);

	const { user } = useUser();

	useEffect(() => {
		socket.on("pair-swipe-action", (data) => {
			console.log("pair-swipe-action", data);
			// Only update if the action was performed by the pair user
			if (data.currentUser.userId !== user?.id) {
				const updatedLikes = {
					...likes,
					pairUser: {
						userId: data.currentUser.userId,
						isLiked: data.currentUser.isLiked,
					},
				};
				setLikes(updatedLikes);
			}
		});
		socket.on("pair-swipe-left", () => {
			setPageState("initial");
		});

		socket.on("pair-swipe-like", () => {
			setPairProfiles((prev) => prev?.slice(1) || []);
			setLikes({
				currentUser: { userId: likes.currentUser.userId ?? "", isLiked: null },
				pairUser: { userId: likes.pairUser.userId ?? "", isLiked: null },
			});
		});

		return () => {
			socket.off("pair-swipe-action");
			socket.off("pair-swipe-left");
			socket.off("pair-swipe-like");
		};
	}, [socket, user?.id, setPageState, likes]);

	const { getToken } = useAuth();

	// Query to get the pair profiles
	useQuery({
		queryKey: ["pairs", currentPairData?.pairId],
		queryFn: async () => {
			if (!currentPairData?.pairId) return [];
			const pairs = await getPairs(await getToken(), currentPairData?.pairId);
			setPairProfiles(pairs ?? []);
			return pairs;
		},
		enabled: !!currentPairData?.pairId,
	});

	const handleSwipe = (direction: "left" | "right") => {
		const isLiked = direction === "right" ? true : false;
		console.log("isLiked", isLiked);
		const updatedLikes = {
			...likes,
			currentUser: {
				userId: user?.id ?? "",
				isLiked,
			},
		};
		setLikes(updatedLikes);
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

		const isPairLike =
			updatedLikes.currentUser.isLiked && updatedLikes.pairUser.isLiked;

		const currentUserLike = updatedLikes.currentUser.isLiked;
		const pairUserLike = updatedLikes.pairUser.isLiked;
		const currentUserDislike = updatedLikes.currentUser.isLiked === false;
		const pairUserDislike = updatedLikes.pairUser.isLiked === false;
		const bothUsersInteracted =
			currentUserLike !== null && pairUserLike !== null;
		const isPairDislike =
			(currentUserDislike || pairUserDislike) && bothUsersInteracted;

		if (isPairLike) {
			setSwipeDirection("right");
			socket.emit("pair-swipe-like", {
				pairLikerId: currentPairData?.pairId ?? "",
				pairLikedId: pairProfiles[0].pairId ?? "",
				isLiked,
				pairLikerUser1Id: pairIds.currentUser ?? "",
				pairLikerUser2Id: pairIds.pairUser ?? "",
			});
		} else if (isPairDislike) {
			setSwipeDirection("left");
			socket.emit("pair-swipe-like", {
				pairLikerId: currentPairData?.pairId ?? "",
				pairLikedId: pairProfiles[0].pairId ?? "",
				isLiked: false,
				pairLikerUser1Id: pairIds.currentUser ?? "",
				pairLikerUser2Id: pairIds.pairUser ?? "",
			});
		}

		if (isPairLike || isPairDislike) {
			setLikes({
				currentUser: { userId: likes.currentUser.userId ?? "", isLiked: null },
				pairUser: { userId: likes.pairUser.userId ?? "", isLiked: null },
			});
		}
	};

	const handleLeaveSession = () => {
		socket.emit("leave-pair-swipe", {
			userId: user?.id ?? "",
			palId: pairIds.pairUser ?? "",
		});
		setPageState("initial");
	};

	return (
		<section>
			<div className="flex items-center justify-center gap-4">
				{/* {"Current User Avatar"} */}
				<Avatar
					imageUrl={currentPairData?.pairUser1Profile?.profileImageUrl ?? ""}
				/>
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
				<Avatar
					imageUrl={currentPairData?.pairUser2Profile?.profileImageUrl ?? ""}
				/>
			</div>
			<div className="grid mt-10 place-content-center">
				{pairProfiles && pairProfiles.length !== 0 && (
					<PairPalCard
						profiles={pairProfiles[0]}
						swipeDirection={swipeDirection}
					/>
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
