import { ServerToClientEvents } from "../../socket";
import { Socket } from "socket.io-client";
import { ClientToServerEvents } from "../../socket";
import { Card, CardContent } from "../../components/Card/Card";
import Label from "../../components/Label/Label";
import { Select } from "../../components/Select/Select";
import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { getPals } from "../../lib/api";
import { useState } from "react";
import { ProfileData } from "../../types/user.types";
import Button from "../../components/Button/Button";
import { Badge } from "../../components/Badge/Badge";
import { Avatar } from "../../components/Avatar/Avatar";
import { Check, X } from "lucide-react";
import SwipeButton from "../../components/SwipeButton/SwipeButton";
import PairPalCard from "../../components/PairPalCard.tsx/PairPalCard";
interface PairSwipePageProps {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

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

export default function PairSwipePage({ socket }: PairSwipePageProps) {
	const { getToken } = useAuth();
	const { user } = useUser();
	const [pals, setPals] = useState<ProfileData[]>([]);
	const [selectedPal, setSelectedPal] = useState<ProfileData | null>(null);
	const [profiles, setProfiles] = useState<ProfileData[][]>([profileData]);
	const [likes, setLikes] = useState<PairSwipeLikes>({
		currentUser: { userId: "user_2ryFwgZm2ynw3BDrhNA5Pyz8B1d", isLiked: null },
		otherUser: { userId: "user_2sN3AY3EMx4ZhodA3S2J5Txu9C7", isLiked: null },
	});

	// const query = useQuery({
	// 	queryKey: ["pals", user?.id],
	// 	queryFn: async () => {
	// 		const token = await getToken();
	// 		if (!token) return [];
	// 		const data = await getPals(token);
	// 		if (data) {
	// 			setPals(data);
	// 		}
	// 		return data ?? [];
	// 	},
	// 	enabled: !!user?.id,
	// 	refetchOnMount: true,
	// 	retry: 3,
	// 	staleTime: 0,
	// });

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const palName = formData.get("swipe-name");
		console.log("palId", palName);
	};

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

	// if (query.isLoading) return <div>Loading...</div>;
	// if (query.isError) return <div>Error: {query.error.message}</div>;

	return (
		<main className="flex flex-col w-screen py-4 h-main-content container-padding">
			{/* <h1 className="mx-auto mb-10 text-4xl font-semibold text-base-content">
				Pair Swipe
			</h1> */}
			{/* <section className="p-4">
				<Card className="max-w-lg mx-auto bg-base-200">
					<CardContent>
						<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
							<Label>
								<span>Invite a Pal to swipe with you</span>
								<Select
									name="swipe-name"
									onChange={(e) => {
										console.log("e", e.currentTarget.value);
										setSelectedPal(
											pals.find((pal) => pal.userId === e.target.value) ?? null
										);
									}}
									value={selectedPal?.userId}
									defaultValue="default"
								>
									<option value="default" disabled>
										Select a Pal
									</option>
									{pals.map((pal) => (
										<option key={pal.userId} value={pal.userId}>
											{pal.firstName}
										</option>
									))}
								</Select>
							</Label>
							{selectedPal && <Button type="submit">Invite</Button>}
						</form>
					</CardContent>
				</Card>
			</section>
			<section className="p-4">
				<Card className="flex flex-col max-w-lg gap-4 px-8 py-4 mx-auto border bg-base-200 border-primary-content">
					<Badge variant="error" size="lg" className="ml-auto">
						Declined
					</Badge>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Avatar />
							<div className="flex flex-col">
								<span className="text-lg font-semibold">John Doe</span>
								<span className="text-sm text-gray-500">You</span>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="flex flex-col">
								<span className="text-lg font-semibold">Jane Doe</span>
								<span className="text-sm text-gray-500">Invited</span>
							</div>
							<Avatar />
						</div>
					</div>
					<div className="flex items-center justify-center gap-2 text-error">
						<CircleX className="w-4 h-4" />
						<span>Session Denied</span>
					</div>
				</Card>
			</section> */}
			<section>
				<div className="flex items-center justify-center gap-4">
					{/* {"Current User Avatar"} */}
					<Avatar />
					<Card className="bg-base-200">
						<CardContent className="flex flex-row items-center justify-center gap-4 p-3">
							{[likes.currentUser, likes.otherUser].map((like) => {
								if (like.isLiked === null) {
									return <Check className="w-10 h-10 text-muted/60" />;
								}
								if (like.isLiked) {
									return (
										<Check
											key={`${like.userId}-liked-check`}
											className="w-10 h-10 text-success"
										/>
									);
								}
								return (
									<X
										key={`${like.userId}-disliked-x`}
										className="w-10 h-10 text-error"
									/>
								);
							})}
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
						/>
						<SwipeButton variant="like" onClick={() => handleSwipe("right")} />
					</div>
				)}
				<div className="flex justify-center">
					<Button variant="error" className="mt-4">
						Leave Session
					</Button>
				</div>
			</section>
		</main>
	);
}
