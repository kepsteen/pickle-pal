import { ServerToClientEvents } from "../../socket";
import { Socket } from "socket.io-client";
import { ClientToServerEvents } from "../../socket";
import { Card, CardContent } from "../../components/Card/Card";
import Label from "../../components/Label/Label";
import { Select } from "../../components/Select/Select";
import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { getPals } from "../../lib/api";
import { useState } from "react";
import { ProfileData } from "../../types/user.types";
import Button from "../../components/Button/Button";
interface PairSwipePageProps {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

export default function PairSwipePage({ socket }: PairSwipePageProps) {
	const { getToken } = useAuth();
	const { user } = useUser();
	const [pals, setPals] = useState<ProfileData[]>([]);
	const [selectedPal, setSelectedPal] = useState<ProfileData | null>(null);
	console.log("socket", socket);

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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const palName = formData.get("swipe-name");
		console.log("palId", palName);
	};

	if (query.isLoading) return <div>Loading...</div>;
	if (query.isError) return <div>Error: {query.error.message}</div>;

	return (
		<main className="flex flex-col w-screen py-4 lg:py-10 h-main-content container-padding">
			<h1 className="mx-auto mb-10 text-4xl font-semibold text-base-content">
				Pair Swipe
			</h1>
			<section className="p-4">
				<Card className="max-w-lg mx-auto bg-base-200">
					<CardContent>
						<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
							<Label>
								<span>Invite a Pal to swipe with you</span>
								<Select
									name="swipe-name"
									onChange={(e) => {
										console.log("e", e.currentTarget.value);
										setSelectedPal(
											pals.find((pal) => pal.userId === e.target.value) ?? null
										);
									}}
									value={selectedPal?.userId}
								>
									<option value="" disabled selected>
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
		</main>
	);
}
