import { Circle, CircleCheck, CircleX } from "lucide-react";
import { Avatar } from "../Avatar/Avatar";
import { Card } from "../Card/Card";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentPair } from "../../lib/api";
import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { ServerToClientEvents, ClientToServerEvents } from "../../socket";
import { Socket } from "socket.io-client";
import { PairData } from "../../types/user.types";
interface PairSwipeInviteCardProps {
	inviteeId: string | undefined;
	inviterId: string | undefined;
	setPageState: (state: "initial" | "invited" | "session joined") => void;
	setCurrentPairData: (pairData: PairData | null) => void;
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

const renderStatus = (inviteStatus: "Pending" | "Accepted" | "Declined") => {
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

export default function PairSwipeInviteCard({
	inviteeId,
	inviterId,
	setPageState,
	setCurrentPairData,
	socket,
}: PairSwipeInviteCardProps) {
	const [inviteStatus, setInviteStatus] = useState<
		"Pending" | "Accepted" | "Declined"
	>("Pending");

	useEffect(() => {
		socket.on("pair-swipe-invite-response", (data) => {
			setInviteStatus(data.status);

			if (data.status === "Accepted") {
				// Both users will automatically transition to session joined
				setPageState("session joined");
			} else if (data.status === "Declined") {
				setPageState("initial");
			}
		});

		// Cleanup listener on unmount
		return () => {
			socket.off("pair-swipe-invite-response");
		};
	}, [socket, setPageState]);

	const { user } = useUser();
	const { getToken } = useAuth();

	const { data, isLoading, error } = useQuery({
		queryKey: ["pair-data", [inviterId, inviteeId].sort().join("_")],
		queryFn: async () => {
			const pairData = await getCurrentPair(
				inviterId,
				inviteeId,
				await getToken()
			);
			setCurrentPairData(pairData);
			return pairData;
		},
		enabled: !!inviterId && !!inviteeId,
	});

	const isInviter = user?.id === inviterId;
	const isInvitee = user?.id === inviteeId;

	const handleInviteResponse = (response: "Accept" | "Decline") => {
		const status = response === "Accept" ? "Accepted" : "Declined";
		socket.emit("pair-swipe-invite-response", {
			inviterId: inviterId ?? "",
			inviteeId: inviteeId ?? "",
			status,
		});

		// Local state update
		setInviteStatus(status);
		// Page state will be updated by the socket response handler
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<section className="p-4">
			<Card className="relative flex flex-col max-w-lg gap-4 px-8 pt-4 pb-12 mx-auto border bg-base-200 border-primary-content">
				{renderStatus(inviteStatus)}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Avatar imageUrl={data?.pairUser1Profile?.profileImageUrl ?? ""} />
						<div className="flex flex-col">
							<span className="text-lg font-semibold">
								{data?.pairUser1Profile?.firstName}
							</span>
							<span className="text-sm text-gray-500">
								{isInviter ? "You" : "Invited You"}
							</span>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex flex-col">
							<span className="text-lg font-semibold">
								{data?.pairUser2Profile?.firstName}
							</span>
							<span className="text-sm text-gray-500">
								{isInvitee ? "You" : "Invited by You"}
							</span>
						</div>
						<Avatar imageUrl={data?.pairUser2Profile?.profileImageUrl ?? ""} />
					</div>
				</div>
				{isInvitee && (
					<div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 mb-4">
						<Button
							onClick={() => handleInviteResponse("Accept")}
							variant="success"
						>
							Accept
						</Button>
						<Button
							onClick={() => handleInviteResponse("Decline")}
							variant="error"
						>
							Decline
						</Button>
					</div>
				)}
			</Card>
		</section>
	);
}
