import { ServerToClientEvents } from "../../socket";
import { Socket } from "socket.io-client";
import { ClientToServerEvents } from "../../socket";
import { useState } from "react";
import PairSwipeInviteCard from "../../components/PaiSwipeInviteCard/PairSwipeInviteCard";
import PairSwipeInviteForm from "../../components/PairSwipeInviteForm/PairSwipeInviteForm";
import PairSwipeSession from "../../components/PairSwipeSession/PairSwipeSession";
import { ProfileData } from "../../types/user.types";

interface PairSwipePageProps {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

export default function PairSwipePage({ socket }: PairSwipePageProps) {
	const [pageState, setPageState] = useState<
		"initial" | "invited" | "session joined"
	>("initial");
	const [invitee, setInvitee] = useState<ProfileData | null>(null);

	const renderCurrentState = () => {
		switch (pageState) {
			case "initial":
				return (
					<PairSwipeInviteForm
						socket={socket}
						setPageState={setPageState}
						setInvitee={setInvitee}
					/>
				);
			case "invited":
				return <PairSwipeInviteCard invitee={invitee} />;
			case "session joined":
				return <PairSwipeSession />;
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
