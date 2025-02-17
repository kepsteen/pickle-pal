import { ServerToClientEvents, ClientToServerEvents } from "../../socket";
import { Socket } from "socket.io-client";
import { useState, useEffect } from "react";
import PairSwipeInviteCard from "../../components/PaiSwipeInviteCard/PairSwipeInviteCard";
import PairSwipeInviteForm from "../../components/PairSwipeInviteForm/PairSwipeInviteForm";
import PairSwipeSession from "../../components/PairSwipeSession/PairSwipeSession";
import { useUser } from "@clerk/clerk-react";
interface PairSwipePageProps {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

export default function PairSwipePage({ socket }: PairSwipePageProps) {
	const [pageState, setPageState] = useState<
		"initial" | "invited" | "session joined"
	>("initial");
	const [inviteeId, setInviteeId] = useState<string | undefined>(undefined);
	const [inviterId, setInviterId] = useState<string | undefined>(undefined);
	const { user } = useUser();

	useEffect(() => {
		if (!user?.id) return;
		socket.on(
			"pair-swipe-joined",
			(data: { userId: string; roomId: string; joined: boolean }) => {
				if (data.joined) {
					console.log("joined pair swipe");
				}
			}
		);

		socket.on(
			"pair-swipe-invite-response",
			(data: {
				inviterId: string;
				inviteeId: string;
				status: "Pending" | "Accepted" | "Declined";
			}) => {
				if (data.status === "Pending") {
					setPageState("invited");
					setInviteeId(data.inviteeId);
					setInviterId(data.inviterId);
					console.log(`${data.inviterId} invited you to pair swipe`);
				}
			}
		);

		socket.emit("join-pair-swipe", { userId: user.id });
		return () => {
			socket.off("pair-swipe-joined");
			socket.off("pair-swipe-invite-response");
		};
	}, [socket, user?.id]);

	const pairIds = {
		currentUser: user?.id,
		pairUser: user?.id === inviteeId ? inviterId : inviteeId,
	};

	const renderCurrentState = () => {
		switch (pageState) {
			case "initial":
				return (
					<PairSwipeInviteForm
						socket={socket}
						setPageState={setPageState}
						setInviteeId={setInviteeId}
						setInviterId={setInviterId}
					/>
				);
			case "invited":
				return (
					<PairSwipeInviteCard
						socket={socket}
						inviteeId={inviteeId}
						inviterId={inviterId}
						setPageState={setPageState}
					/>
				);
			case "session joined":
				return (
					<PairSwipeSession
						pairIds={pairIds}
						socket={socket}
						setPageState={setPageState}
					/>
				);
			// Todo: Add a case for "session ended"
		}
	};

	return (
		<main className="flex flex-col w-screen py-4 h-main-content container-padding">
			<h1 className="mx-auto mb-10 text-4xl font-semibold text-base-content">
				Pair Swipe
			</h1>
			{renderCurrentState()}
		</main>
	);
}
