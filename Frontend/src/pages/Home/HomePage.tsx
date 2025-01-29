import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import PalCard from "../../components/PalCard/PalCard";
import SwipeButton from "../../components/SwipeButton/SwipeButton";
import { ProfileData } from "../../types/profileSchema";
import { getNearbyUsers, setLocation } from "../../lib/api";
import { useEffect, useState } from "react";
import { SetLocation } from "../../components/SetLocation/SetLocation.tsx";
import { useAuth } from "../../providers/AuthContextProvider.tsx";
import { formatCoordinates } from "../../lib/utils.ts";

export default function HomePage() {
	const [profiles, setProfiles] = useState<ProfileData[] | undefined>([]);
	const [index, setIndex] = useState(0);
	const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
		null
	);
	const [maxDistance, setMaxDistance] = useState(25);
	const [position, setPosition] = useState<GeolocationPosition | null>(null);
	const { token } = useAuth();
	// Update user location on mount

	useEffect(() => {
		if (token) {
			navigator.geolocation.getCurrentPosition(async (position) => {
				try {
					setPosition(position);
					await setLocation(position, token);
				} catch (error) {
					console.error("Failed to set location:", error);
				}
			});
		}
	}, [token]);

	// Fetch profiles
	const query = useQuery({
		queryKey: [
			"nearby-profiles",
			token,
			formatCoordinates(position),
			maxDistance,
		],
		queryFn: async () => {
			const data = await getNearbyUsers(
				formatCoordinates(position),
				maxDistance,
				token
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
			<SetLocation
				maxDistance={maxDistance}
				setMaxDistance={setMaxDistance}
				setPosition={setPosition}
			/>
			<div className="grid mt-10 place-content-center">
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
		</>
	);
}
