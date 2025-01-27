import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import PalCard from "../../components/PalCard/PalCard";
import SwipeButton from "../../components/SwipeButton/SwipeButton";
import { ProfileData } from "../../types/profileSchema";
import { getNearbyUsers } from "../../lib/api";
import { useEffect, useState } from "react";
import { SetLocation } from "../../components/SetLocation/SetLocation.tsx";
import { useAuth } from "@clerk/clerk-react";

export default function HomePage() {
	const [profiles, setProfiles] = useState<ProfileData[] | undefined>([]);
	const [index, setIndex] = useState(5);
	const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
		null
	);
	const [position, setPosition] = useState<GeolocationPosition | null>(null);
	const { getToken } = useAuth();

	console.log("profiles", profiles);
	// Fetch profiles
	const query = useQuery({
		queryKey: ["nearbyProfiles", position, token],
		queryFn: async () => {
			const token = await getToken();
			if (!position || !token) return null;
			const coords = [position.coords.longitude, position.coords.latitude];
			const data = await getNearbyUsers(coords, 1000, token);
			setProfiles(data);
			return data;
		},
	});

	useEffect(() => {
		if (position) {
			query.refetch();
		}
	}, [position]);

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
			<SetLocation setPosition={setPosition} position={position} />
		</>
	);
}
