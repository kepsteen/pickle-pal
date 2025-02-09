import { ProfileData } from "../../types/user.types";
import { AnimatePresence } from "framer-motion";
import PalCard from "../PalCard/PalCard";
import { cn } from "../../lib/utils";

interface PairPalCardProps {
	profiles: ProfileData[];
	swipeDirection: "left" | "right";
	className?: string;
}

export default function PairPalCard({
	profiles,
	swipeDirection,
	className,
}: PairPalCardProps) {
	return (
		<AnimatePresence mode="wait">
			<div className="relative lg:flex h-[560px]">
				{profiles.map((profile, index) => (
					<div
						key={profile.userId}
						className={cn(
							"absolute left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 lg:static hover:z-30",
							index === 1 ? "translate-y-[60px] lg:translate-y-0" : ""
						)}
					>
						<PalCard
							profile={profile}
							swipeDirection={swipeDirection}
							className={cn(
								"mx-0 transform max-w-[350px] md:max-w-[400px] lg:max-w-[500px]",
								index === 0 ? "lg:-rotate-3 lg:-mr-4" : "lg:rotate-3 lg:-ml-4",
								className
							)}
						/>
					</div>
				))}
			</div>
		</AnimatePresence>
	);
}
