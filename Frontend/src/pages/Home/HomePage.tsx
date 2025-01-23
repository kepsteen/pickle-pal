import { useQuery } from "@tanstack/react-query";
import PalCard from "../../components/PalCard/PalCard";
import SwipeButton from "../../components/SwipeButton/SwipeButton";
import { ProfileData } from "../../types/profileSchema";
import { getUsers } from "../../lib/api";
import { useState } from "react";

export default function HomePage() {
	const [profiles, setProfiles] = useState<ProfileData[]>([]);
	const [index, setIndex] = useState(5);
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

	return (
		<>
			<div className="grid place-content-center">
				<PalCard profile={profiles[index]} />
			</div>
			<div className="flex justify-center gap-8 mt-8">
				<SwipeButton
					variant="dislike"
					onClick={() => {
						setIndex((prev) => prev - 1);
					}}
				/>
				<SwipeButton
					variant="like"
					onClick={() => {
						setIndex((prev) => prev + 1);
					}}
				/>
			</div>
		</>
	);
}
