import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import PalCard from "../../components/PalCard/PalCard";
import SwipeButton from "../../components/SwipeButton/SwipeButton";
import { ProfileData } from "../../types/user.types.ts";
import { addLike, getNearbyUsers, setLocation } from "../../lib/api";
import { useEffect, useState } from "react";
import { SetLocation } from "../../components/SetLocation/SetLocation.tsx";
import { formatCoordinates } from "../../lib/utils.ts";
import { toast } from "react-hot-toast";
import { MatchToast } from "../../components/Toast/Toast";
import { useAuth } from "@clerk/clerk-react";

export default function HomePage() {
	const [profiles, setProfiles] = useState<ProfileData[] | undefined>([]);
	const [maxDistance, setMaxDistance] = useState(25);
	const [position, setPosition] = useState<GeolocationPosition | null>(null);
	const [isLoadingPosition, setIsLoadingPosition] = useState(true);
	const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
		null
	);

	const { getToken } = useAuth();

	// Update user location on mount
	useEffect(() => {
		const getLocation = async () => {
			setIsLoadingPosition(true);
			const token = await getToken();
			if (token) {
				navigator.geolocation.getCurrentPosition(
					async (position) => {
						try {
							setPosition(position);
							await setLocation(position, token);
						} catch (error) {
							console.error("Failed to set location:", error);
						} finally {
							setIsLoadingPosition(false);
						}
					},
					(error) => {
						console.error("Geolocation error:", error);
						setIsLoadingPosition(false);
					}
				);
			} else {
				setIsLoadingPosition(false);
			}
		};
		getLocation();
	}, [getToken]);

	// Fetch profiles
	const query = useQuery({
		queryKey: ["nearby-profiles", formatCoordinates(position), maxDistance],
		queryFn: async () => {
			const token = await getToken();
			if (!token) return;
			const data = await getNearbyUsers(
				formatCoordinates(position),
				maxDistance,
				token
			);
			setProfiles(data);
			return data;
		},
		enabled: !!position,
		refetchOnMount: true,
	});

	const swipeMutation = useMutation({
		mutationKey: ["swipe", profiles?.[0]?.userId],
		mutationFn: async (isLike: boolean) => {
			if (!profiles?.length) return;
			const token = await getToken();
			if (!token) return;
			const data = await addLike(profiles[0].userId, isLike, token);
			if (data?.isMatch) {
				toast(
					<MatchToast
						name={data.matchedUser!.firstName}
						imageUrl={data.matchedUser!.profileImageUrl ?? ""}
					/>
				);
			}
			return data;
		},
	});

	if (isLoadingPosition)
		return (
			<div className="mt-10 text-lg text-center">
				Finding players near you...
			</div>
		);
	if (query.isLoading)
		return (
			<div className="mt-10 text-lg text-center">Loading potential pals...</div>
		);
	if (query.isError)
		return (
			<div className="mt-10 text-lg text-center text-error">{`Error loading profiles: ${query.error}`}</div>
		);

	const handleSwipeInteraction = (isLike: boolean) => {
		setSwipeDirection(isLike ? "right" : "left");
		swipeMutation.mutate(isLike);
		setProfiles((prev) => prev?.slice(1) || []);
	};

	return (
		<>
			<SetLocation
				maxDistance={maxDistance}
				setMaxDistance={setMaxDistance}
				setPosition={setPosition}
			/>
			<div className="grid mt-10 place-content-center">
				{profiles && profiles[0] && (
					<AnimatePresence mode="wait">
						<PalCard
							key={profiles[0].userId}
							profile={profiles[0]}
							swipeDirection={swipeDirection}
						/>
					</AnimatePresence>
				)}
			</div>
			{profiles && profiles.length !== 0 && (
				<div className="flex justify-center gap-8 mt-8">
					<SwipeButton
						variant="dislike"
						onClick={() => handleSwipeInteraction(false)}
					/>
					<SwipeButton
						variant="like"
						onClick={() => handleSwipeInteraction(true)}
					/>
				</div>
			)}
		</>
	);
}
