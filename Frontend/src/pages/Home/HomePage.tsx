import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import PalCard from "../../components/PalCard/PalCard";
import SwipeButton from "../../components/SwipeButton/SwipeButton";
import { ProfileData } from "../../types/profileSchema";
import { getUsers } from "../../lib/api";
import { useState } from "react";
import { SetLocation } from "../../components/SetLocation/SetLocation";

export default function HomePage() {
	const [profiles, setProfiles] = useState<ProfileData[]>([]);
	const [index, setIndex] = useState(5);
	const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
		null
	);

	// Fetch profiles
	const query = useQuery({
		queryKey: ["profiles"],
		queryFn: async () => {
			const data = await getUsers("user_2rgLaUCcJmigG45v2SAn89Bex9O");
			setProfiles(data);
			return data;
		},
	});

	if (query.isLoading) return <div>Loading...</div>;
	if (query.isError)
		return <div>{`Error loading profiles: ${query.error}`}</div>;

	const handleSwipe = (direction: "left" | "right") => {
		setSwipeDirection(direction);
		setTimeout(() => {
			setIndex((prev) => prev + (direction === "right" ? 1 : -1));
			setSwipeDirection(null);
		}, 100);
	};

	return (
		<>
			<div className="grid place-content-center">
				<AnimatePresence mode="wait">
					{profiles[index] && (
						<PalCard
							key={index}
							profile={profiles[index]}
							swipeDirection={swipeDirection}
						/>
					)}
				</AnimatePresence>
			</div>
			<div className="flex justify-center gap-8 mt-8">
				<SwipeButton variant="dislike" onClick={() => handleSwipe("left")} />
				<SwipeButton variant="like" onClick={() => handleSwipe("right")} />
			</div>
			<SetLocation />
		</>
	);
}
