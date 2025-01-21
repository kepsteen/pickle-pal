import { ProfileData } from "../../types/profileSchema";
import { Badge } from "../Badge/Badge";
import { Card, CardContent, CardTitle } from "../Card/Card";

function getSkillLevelBadgeVariant(skillLevel: string) {
	switch (skillLevel) {
		case "Beginner":
			return "primary";
		case "Intermediate":
			return "warning";
		case "Advanced":
			return "error";
	}
}

type PalCardProps = {
	profile: ProfileData;
};

export default function PalCard({ profile }: PalCardProps) {
	return (
		<Card className="w-full h-full mx-4 rounded-b-md max-w-96">
			<CardTitle className="bg-base-200 rounded-t-md">
				<div className="flex items-center gap-2">
					<h1 className="text-lg font-semibold">{profile.firstName}</h1>
					<Badge variant={getSkillLevelBadgeVariant(profile.skillLevel)}>
						{profile.skillLevel}
					</Badge>
				</div>
			</CardTitle>
			<CardContent className="flex flex-col bg-base-200 rounded-b-md">
				<div className="w-full mb-4 h-60">
					<img
						src={profile.profileImageUrl}
						alt={`${profile.firstName}'s profile picture`}
						className="object-cover object-top w-full h-full rounded-md"
					/>
				</div>
				<h2 className="font-semibold">Playstyle</h2>
				<Badge
					variant="outline"
					size="md"
					className="px-4 border-info text-info"
				>
					{profile.playStyle}
				</Badge>
				<h2 className="font-semibold">Looking For</h2>
				<div className="flex flex-wrap gap-2">
					{profile.lookingFor.competitive && (
						<Badge variant="outline" size="md" className="px-4">
							Good Competition
						</Badge>
					)}
					{profile.lookingFor.friends && (
						<Badge variant="outline" size="md" className="px-4">
							Friends
						</Badge>
					)}
					{profile.lookingFor.casual && (
						<Badge variant="outline" size="md" className="px-4">
							Casual Games
						</Badge>
					)}
					{profile.lookingFor.drilling && (
						<Badge variant="outline" size="md" className="px-4">
							Drill Partner
						</Badge>
					)}
				</div>
				<h2 className="font-semibold">Bio</h2>
				<p className="font-normal text-muted">{profile.bio}</p>
			</CardContent>
		</Card>
	);
}
