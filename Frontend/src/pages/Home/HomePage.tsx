import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import PalCard from "../../components/PalCard/PalCard";
import SwipeButton from "../../components/SwipeButton/SwipeButton";
import { ProfileData } from "../../types/profileSchema";
import { getNearbyUsers } from "../../lib/api";
import { useState } from "react";
import { SetLocation } from "../../components/SetLocation/SetLocation.tsx";

export default function HomePage() {
	const [profiles, setProfiles] = useState<ProfileData[] | undefined>([]);
	const [index, setIndex] = useState(0);
	const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
		null
	);
	const [position, setPosition] = useState<GeolocationPosition | null>(null);

	// Fetch profiles
	const query = useQuery({
		queryKey: ["profiles"],
		queryFn: async () => {
			const data = await getNearbyUsers(
				[-117.81791731292606, 33.63175885481366],
				1000,
				""
			);
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
				{profiles && profiles[index] && (
					<AnimatePresence mode="wait">
						<PalCard
							key={index}
							profile={profiles[index]}
							swipeDirection={swipeDirection}
						/>
					</AnimatePresence>
				)}
			</div>
			<div className="flex justify-center gap-8 mt-8">
				<SwipeButton variant="dislike" onClick={() => handleSwipe("left")} />
				<SwipeButton variant="like" onClick={() => handleSwipe("right")} />
			</div>
			<SetLocation setPosition={setPosition} position={position} />
		</>
	);
}
