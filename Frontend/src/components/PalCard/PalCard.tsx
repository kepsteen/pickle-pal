import { cn } from "../../lib/utils";
import { ProfileData } from "../../types/user.types";
import { Badge } from "../Badge/Badge";
import { Card, CardContent } from "../Card/Card";
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
	disableAnimation?: boolean;
};

export default function PalCard({
	profile,
	className,
	swipeDirection,
	disableAnimation = false,
}: PalCardProps) {
	return (
		<motion.div
			initial={disableAnimation ? { opacity: 1, x: 0 } : { opacity: 0, x: 200 }}
			animate={{ opacity: 1, x: 0 }}
			exit={
				disableAnimation
					? { opacity: 0 }
					: {
							opacity: 0,
							x: swipeDirection === "left" ? -200 : 200,
							transition: { duration: 0.1 },
					  }
			}
			whileHover={disableAnimation ? {} : { scale: 1.05 }}
			transition={{ duration: 0.2 }}
		>
			<Card
				className={cn(
					"mx-4 rounded-b-md w-[500px] transition-all duration-200 shadow-pal-card",
					className
				)}
			>
				<CardContent className="flex flex-col gap-4 pt-4 bg-base-200 rounded-b-md">
					<div className="relative flex-shrink-0 w-full h-56">
						<img
							src={profile.profileImageUrl}
							alt={`${profile.firstName}'s profile picture`}
							className="object-cover object-top w-full h-full rounded-md"
						/>
						<div className="absolute top-0 left-0 w-full p-3 pb-8 bg-gradient-to-b from-black/80 via-black/50 to-transparent">
							<div className="flex items-center gap-2">
								<h1 className="text-xl font-semibold text-white">
									{profile.firstName}
								</h1>
								<Badge
									variant={getSkillLevelBadgeVariant(profile.skillLevel)}
									size="md"
								>
									{profile.skillLevel}
								</Badge>
							</div>
						</div>
					</div>
					<div>
						<h2 className="flex-shrink-0 font-semibold">Playstyle</h2>
						<Badge
							variant="outline"
							size="md"
							className="flex-shrink-0 px-4 border-info text-info"
						>
							{profile.playStyle}
						</Badge>
					</div>
					<div>
						<h2 className="flex-shrink-0 font-semibold">Looking For</h2>
						<div className="flex flex-wrap flex-shrink-0 gap-2">
							{profile.lookingFor.map((item) => renderLookingForBadge(item))}
						</div>
					</div>
					<div>
						<h2 className="flex-shrink-0 font-semibold">Bio</h2>
						<p className="text-muted">{profile.bio}</p>
					</div>
				</CardContent>
				<div className="p-4 bg-base-300 rounded-b-md">
					<h2 className="flex-shrink-0 px-4 font-semibold">
						DUPR <span className="pl-2 text-primary">{profile.duprRating}</span>
					</h2>
				</div>
			</Card>
		</motion.div>
	);
}
