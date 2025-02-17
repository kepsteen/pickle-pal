import { Circle, CircleCheck, CircleX } from "lucide-react";
import { Avatar } from "../Avatar/Avatar";
import { Card } from "../Card/Card";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../lib/api";
import { useState } from "react";

interface PairSwipeInviteCardProps {
	inviteeId: string | undefined;
}

export default function PairSwipeInviteCard({
	inviteeId,
}: PairSwipeInviteCardProps) {
	const [inviteStatus] = useState<"Pending" | "Accepted" | "Declined">(
		"Pending"
	);
	const { user } = useUser();
	const { getToken } = useAuth();

	const query = useQuery({
		queryKey: ["users", user?.id, inviteeId],
		queryFn: async () => {
			const [currentUserData, inviteeData] = await Promise.all([
				getUserById(user?.id, getToken),
				getUserById(inviteeId, getToken),
			]);
			return { currentUserData, inviteeData };
		},
		enabled: !!user?.id && !!inviteeId,
	});

	const renderStatus = () => {
		switch (inviteStatus) {
			case "Declined":
				return (
					<div className="flex items-center justify-center gap-2 text-error">
						<CircleX className="w-4 h-4" />
						<span>Session Declined</span>
					</div>
				);
			case "Accepted":
				return (
					<div className="flex items-center justify-center gap-2 text-success">
						<CircleCheck className="w-4 h-4" />
						<span>Session Accepted</span>
					</div>
				);
			case "Pending":
				return (
					<div className="flex items-center justify-center gap-2 text-warning">
						<Circle className="w-4 h-4" />
						<span>Session Pending</span>
					</div>
				);
		}
	};

	if (query.isLoading) return <div>Loading...</div>;
	if (query.error) return <div>Error: {query.error.message}</div>;

	return (
		<section className="p-4">
			<Card className="flex flex-col max-w-lg gap-4 px-8 pt-4 pb-12 mx-auto border bg-base-200 border-primary-content">
				{renderStatus()}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Avatar
							imageUrl={query.data?.currentUserData?.profileImageUrl ?? ""}
						/>
						<div className="flex flex-col">
							<span className="text-lg font-semibold">
								{query.data?.currentUserData?.firstName}
							</span>
							<span className="text-sm text-gray-500">You</span>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex flex-col">
							<span className="text-lg font-semibold">
								{query.data?.inviteeData?.firstName}
							</span>
							<span className="text-sm text-gray-500">Invited</span>
						</div>
						<Avatar imageUrl={query.data?.inviteeData?.profileImageUrl ?? ""} />
					</div>
				</div>
			</Card>
		</section>
	);
}
