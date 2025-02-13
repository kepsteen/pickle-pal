import { CircleX } from "lucide-react";
import { Avatar } from "../Avatar/Avatar";
import { Badge } from "../Badge/Badge";
import { Card } from "../Card/Card";

export default function PairSwipeInviteCard() {
	return (
		<section className="p-4">
			<Card className="flex flex-col max-w-lg gap-4 px-8 py-4 mx-auto border bg-base-200 border-primary-content">
				<Badge variant="error" size="lg" className="ml-auto">
					Declined
				</Badge>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Avatar />
						<div className="flex flex-col">
							<span className="text-lg font-semibold">John Doe</span>
							<span className="text-sm text-gray-500">You</span>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex flex-col">
							<span className="text-lg font-semibold">Jane Doe</span>
							<span className="text-sm text-gray-500">Invited</span>
						</div>
						<Avatar />
					</div>
				</div>
				<div className="flex items-center justify-center gap-2 text-error">
					<CircleX className="w-4 h-4" />
					<span>Session Denied</span>
				</div>
			</Card>
		</section>
	);
}
