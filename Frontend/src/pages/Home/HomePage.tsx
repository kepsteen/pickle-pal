import { useQuery } from "@tanstack/react-query";
import PalCard from "../../components/PalCard/PalCard";
import SwipeButton from "../../components/SwipeButton/SwipeButton";
import { ProfileData } from "../../types/profileSchema";
import { getUsers } from "../../lib/api";

export default function HomePage() {
	const query = useQuery({
		queryKey: ["profiles"],
		queryFn: () => getUsers("user_2rgLaUCcJmigG45v2SAn89Bex9O"),
	});

	if (query.isLoading) return <div>Loading...</div>;
	if (query.isError)
		return <div>{`Error loading profiles: ${query.error}`}</div>;

	return (
		<>
			<div className="grid grid-cols-1 grid-rows-1 place-content-center">
				{query.data?.map((user: ProfileData) => (
					<PalCard
						key={`${user.profileImageUrl}-${user.duprRating}`}
						profile={user}
						className="col-start-1 row-start-1"
					/>
				))}
			</div>
			<div className="flex justify-center gap-8 mt-8">
				<SwipeButton variant="dislike" />
				<SwipeButton variant="like" />
			</div>
		</>
	);
}
