import { Check, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface SwipeIndicatorProps {
	userId: string | undefined;
	isLiked: boolean | null;
}

export default function SwipeIndicator({
	userId,
	isLiked,
}: SwipeIndicatorProps) {
	return (
		<div className="relative w-10 h-10">
			<AnimatePresence mode="wait">
				<motion.div
					key={`${userId}-${isLiked}`}
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0, opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="absolute inset-0"
				>
					{isLiked === null ? (
						<Check className="w-10 h-10 text-muted/60" />
					) : isLiked ? (
						<Check className="w-10 h-10 text-success" />
					) : (
						<X className="w-10 h-10 text-error" />
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
