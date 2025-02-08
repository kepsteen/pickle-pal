import { ServerToClientEvents } from "../../socket";
import { Socket } from "socket.io-client";
import { ClientToServerEvents } from "../../socket";

interface PairSwipePageProps {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

export default function PairSwipePage({ socket }: PairSwipePageProps) {
	return <div>PairSwipePage</div>;
}
