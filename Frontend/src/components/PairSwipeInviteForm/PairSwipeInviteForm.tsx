import Button from "../Button/Button";
import { Card, CardContent } from "../Card/Card";
import Label from "../Label/Label";
import { Select } from "../Select/Select";
import { ProfileData } from "../../types/user.types";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getPals } from "../../lib/api";
import { useState } from "react";
import { Socket } from "socket.io-client";
import { ServerToClientEvents } from "../../socket";
import { ClientToServerEvents } from "../../socket";

interface PairSwipeInviteFormProps {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	setPageState: (pageState: "initial" | "invited" | "session joined") => void;
	setInvitee: (invitee: ProfileData | null) => void;
}
export default function PairSwipeInviteForm({
	socket,
	setPageState,
	setInvitee,
}: PairSwipeInviteFormProps) {
	const [pals, setPals] = useState<ProfileData[]>([]);
	const [selectedPal, setSelectedPal] = useState<ProfileData | null>(null);

	const { getToken } = useAuth();
	const { user } = useUser();

	const query = useQuery({
		queryKey: ["pals", user?.id],
		queryFn: async () => {
			const token = await getToken();
			if (!token) return [];
			const data = await getPals(token);
			if (data) {
				setPals(data);
			}
			return data ?? [];
		},
		enabled: !!user?.id,
		refetchOnMount: true,
		retry: 3,
		staleTime: 0,
	});

	if (query.isLoading) return <div>Loading...</div>;
	if (query.isError) return <div>Error: {query.error.message}</div>;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!user?.id || !selectedPal) return;
		socket.emit("pair-swipe-invite", {
			inviterId: user?.id,
			inviteeId: selectedPal.userId,
		});
		setInvitee(selectedPal);
		setPageState("invited");
	};
	return (
		<section className="p-4">
			<Card className="max-w-lg mx-auto bg-base-200">
				<CardContent>
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<Label>
							<span>Invite a Pal to swipe with you</span>
							<Select
								name="invite-palId"
								onChange={(e) => {
									setSelectedPal(
										pals.find((pal) => pal.userId === e.target.value) ?? null
									);
								}}
								value={selectedPal?.userId}
								defaultValue="default"
							>
								<option value="default" disabled>
									Select a Pal
								</option>
								{pals.map((pal) => (
									<option key={pal.userId} value={pal.userId}>
										{pal.firstName}
									</option>
								))}
							</Select>
						</Label>
						{selectedPal && <Button type="submit">Invite</Button>}
					</form>
				</CardContent>
			</Card>
		</section>
	);
}
