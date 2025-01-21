import PalCard from "../../components/PalCard/PalCard";
import SwipeButton from "../../components/SwipeButton/SwipeButton";
import { ProfileData } from "../../types/profileSchema";

const sampleProfileData: ProfileData = {
	firstName: "John Smith",
	skillLevel: "Intermediate",
	playStyle: "Hybrid",
	lookingFor: {
		competitive: true,
		casual: true,
		friends: false,
		drilling: true,
	},
	duprRating: 4.5,
	bio: "Pickleball enthusiast looking to improve my game. Love both competitive matches and casual play. Always up for drilling sessions to work on technique!",
	profileImageUrl:
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrZc7xvjAho14mkPoAnzswKEhAa7hj6Nz4piz0YIIG-csxkvrsDJgB_fvMsGYgDKD9WqrSe2pQb6H0Sdd4n05Aog",
};

export default function HomePage() {
	return (
		<>
			<PalCard profile={sampleProfileData} />
			<div className="flex justify-center gap-8 mt-8">
				<SwipeButton variant="dislike" />
				<SwipeButton variant="like" />
			</div>
		</>
	);
}
