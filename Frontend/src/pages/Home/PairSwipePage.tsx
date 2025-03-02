import { ServerToClientEvents, ClientToServerEvents } from "../../socket";
import { Socket } from "socket.io-client";
import { useState, useEffect } from "react";
import PairSwipeInviteCard from "../../components/PaiSwipeInviteCard/PairSwipeInviteCard";
import PairSwipeInviteForm from "../../components/PairSwipeInviteForm/PairSwipeInviteForm";
import PairSwipeSession from "../../components/PairSwipeSession/PairSwipeSession";
import { useUser, useAuth } from "@clerk/clerk-react";
import { PairData } from "../../types/user.types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getPairSwipeSession, savePairSwipeSession } from "../../lib/api";

interface PairSwipePageProps {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

export default function PairSwipePage({ socket }: PairSwipePageProps) {
	const [pageState, setPageState] = useState<
		"initial" | "invited" | "session joined"
	>("initial");
	const [inviteeId, setInviteeId] = useState<string | undefined>(undefined);
	const [inviterId, setInviterId] = useState<string | undefined>(undefined);
	const [currentPairData, setCurrentPairData] = useState<PairData | null>(null);
	const { user } = useUser();
	const { getToken } = useAuth();

	const { data: recoveredPairSwipeSession } = useQuery({
		queryKey: ["pair-swipe-session-recovery", user?.id],
		queryFn: async () => {
			const token = await getToken();
			if (!token) return;
			const data = await getPairSwipeSession(token);
			return data;
		},
	});

	const { mutate: saveSession } = useMutation({
		mutationFn: async (status: "Pending" | "Accepted" | "Declined") => {
			const token = await getToken();
			if (!token) return;
			if (status === "Accepted") {
				const data = await savePairSwipeSession(token, {
					pageState: "invited",
					inviteeId: user?.id,
					inviterId: inviterId,
					currentPairData: currentPairData,
				});
				return data;
			}
		},
	});

	useEffect(() => {
		if (!user?.id) return;
		if (recoveredPairSwipeSession) {
			setPageState(recoveredPairSwipeSession.pageState);
			setInviteeId(recoveredPairSwipeSession.inviteeId);
			setInviterId(recoveredPairSwipeSession.inviterId);
			// setCurrentPairData(recoveredPairSwipeSession.currentPairData ?? null);
		}

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
					saveSession(data.status);
					console.log(`${data.inviterId} invited you to pair swipe`);
				}
			}
		);

		socket.emit("join-pair-swipe", { userId: user.id });
		return () => {
			socket.off("pair-swipe-joined");
			socket.off("pair-swipe-invite-response");
		};
	}, [socket, user?.id, recoveredPairSwipeSession, saveSession]);

	const pairIds = {
		currentUser: user?.id,
		pairUser: user?.id === inviteeId ? inviterId : inviteeId,
	};

	const renderCurrentState = (
		pageState: "initial" | "invited" | "session joined"
	) => {
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
						setCurrentPairData={setCurrentPairData}
					/>
				);
			case "session joined":
				return (
					<PairSwipeSession
						pairIds={pairIds}
						currentPairData={currentPairData}
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
			{renderCurrentState(pageState)}
		</main>
	);
}
