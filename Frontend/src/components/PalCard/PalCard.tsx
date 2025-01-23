import { cn } from "../../lib/utils";
import { ProfileData } from "../../types/profileSchema";
import { Badge } from "../Badge/Badge";
import { Card, CardContent, CardTitle } from "../Card/Card";
import { motion } from "framer-motion";

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

const labels = {
	competitive: "Good Competition",
	friends: "Friends",
	casual: "Casual Games",
	drilling: "Drill Partner",
};

function renderLookingForBadge(item: string) {
	return (
		<Badge key={item} variant="outline" size="md" className="px-4">
			{labels[item as keyof typeof labels]}
		</Badge>
	);
}

type PalCardProps = {
	profile: ProfileData;
	className?: string;
	swipeDirection: "left" | "right" | null;
};

export default function PalCard({
	profile,
	className,
	swipeDirection,
}: PalCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, x: 200 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{
				opacity: 0,
				x: swipeDirection === "left" ? -200 : 200,
				transition: { duration: 0.1 },
			}}
		>
			<Card className={cn("mx-4 rounded-b-md w-[500px]", className)}>
				<CardTitle className="bg-base-200 rounded-t-md">
					<div className="flex items-center gap-2">
						<h1 className="text-3xl font-semibold">{profile.firstName}</h1>
						<Badge
							variant={getSkillLevelBadgeVariant(profile.skillLevel)}
							size="lgmm"
						>
							{profile.skillLevel}
						</Badge>
					</div>
				</CardTitle>
				<CardContent className="flex flex-col bg-base-200 rounded-b-md">
					<div className="flex-shrink-0 w-full mb-4 h-96">
						<img
							src={profile.profileImageUrl}
							alt={`${profile.firstName}'s profile picture`}
							className="object-cover object-top w-full h-full rounded-md"
						/>
					</div>
					<h2 className="flex-shrink-0 font-semibold">Playstyle</h2>
					<Badge
						variant="outline"
						size="md"
						className="flex-shrink-0 px-4 border-info text-info"
					>
						{profile.playStyle}
					</Badge>
					<h2 className="flex-shrink-0 font-semibold">Looking For</h2>
					<div className="flex flex-wrap flex-shrink-0 h-12 gap-2">
						{profile.lookingFor.map((item) => renderLookingForBadge(item))}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
