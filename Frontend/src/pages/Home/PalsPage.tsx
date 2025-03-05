import { useQuery } from "@tanstack/react-query";
import PalCardCondensed from "../../components/PalCardCondensed/PalCardCondensed";
import { getPals } from "../../lib/api";
import { useState, useEffect } from "react";
import { ProfileData } from "../../types/user.types.ts";
import { NavLink, useParams } from "react-router";
import { ChevronLeft, EllipsisVerticalIcon, X } from "lucide-react";
import { cn } from "../../lib/utils.ts";
import ChatWindow from "../../components/ChatWindow/ChatWindow.tsx";
import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../socket.ts";
import { useAuth } from "@clerk/clerk-react";
import Button from "../../components/Button/Button";
import PalCard from "../../components/PalCard/PalCard";

interface PalsPageProps {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}
export default function PalsPage({ socket }: PalsPageProps) {
	const [pals, setPals] = useState<ProfileData[]>([]);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [selectedPal, setSelectedPal] = useState<ProfileData | null>(null);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const { userId } = useParams();
	const { getToken } = useAuth();

	useEffect(() => {
		setIsChatOpen(!!userId);
	}, [userId]);

	const query = useQuery({
		queryKey: ["pals", userId],
		queryFn: async () => {
			const token = await getToken();
			if (!token) return [];
			const data = await getPals(token);
			if (data) {
				setPals(data);
			}
			return data ?? [];
		},
		refetchOnMount: true,
		retry: 3,
		staleTime: 0,
	});

	const openProfileModal = (pal: ProfileData) => {
		setSelectedPal(pal);
		setIsProfileModalOpen(true);
	};

	const closeProfileModal = () => {
		setIsProfileModalOpen(false);
		setSelectedPal(null);
	};

	if (query.isLoading) return <div>Loading...</div>;
	if (query.isError) return <div>Error: {query.error.message}</div>;

	return (
		<main className="flex w-screen py-4 lg:py-10 h-main-content container-padding">
			<aside
				className={cn(
					"px-4 md:px-8 w-full",
					isChatOpen
						? "hidden lg:block lg:w-auto max-w-[350px] 2xl:max-w-none"
						: "block lg:w-full"
				)}
			>
				<h1
					className={cn(
						"mb-10 text-4xl font-semibold text-base-content",
						!isChatOpen ? "text-center" : ""
					)}
				>
					Pals
				</h1>
				<ul className="flex flex-col w-full max-w-[350px] h-full gap-4 mx-auto overflow-y-auto">
					<p className="sr-only">Pals List</p>
					{pals.length === 0 && (
						<li>
							<p>No pals found</p>
						</li>
					)}
					{pals.map((pal) => (
						<li key={pal.userId}>
							<PalCardCondensed
								palId={pal.userId}
								name={pal.firstName}
								imageUrl={pal.profileImageUrl}
								className="mx-auto"
							/>
						</li>
					))}
				</ul>
			</aside>
			{userId && (
				<section
					id="chat-section"
					className="grid grid-rows-[auto_1fr_auto] lg:border-l-4 grow border-l-base-200"
				>
					{pals
						.filter((pal) => pal.userId === userId)
						.map((pal) => (
							<div
								key={`chat-${pal.userId}`}
								className="flex items-center justify-between pb-4 border-b-4 border-b-base-200"
							>
								<div className="flex items-center justify-start gap-8 px-8">
									<NavLink to="/pals">
										<ChevronLeft className="w-6 h-6 text-primary" />
									</NavLink>
									<div className="avatar">
										<div className="w-16 rounded-full ring-primary ring-offset-base-100 ring ring-offset-2">
											<img src={pal.profileImageUrl} />
										</div>
									</div>
									<span className="text-2xl font-semibold text-base-content">
										{pal.firstName}
									</span>
								</div>
								<div className="dropdown dropdown-end">
									<Button
										variant="ghost"
										tabIndex={0}
										role="button"
										className="p-0 hover:bg-transparent"
									>
										<EllipsisVerticalIcon className="w-6 h-6 text-primary" />
									</Button>
									<ul
										tabIndex={0}
										className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 shadow p-0"
									>
										<li>
											<Button
												variant="ghost"
												onClick={() => openProfileModal(pal)}
											>
												View Profile
											</Button>
										</li>
									</ul>
								</div>
							</div>
						))}
					<ChatWindow palId={userId} socket={socket} />
				</section>
			)}

			{/* Profile Modal */}
			{isProfileModalOpen && selectedPal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="relative w-full max-w-3xl p-4">
						<Button
							variant="ghost"
							size="md"
							className="absolute z-10 p-2 shadow-md top-4 right-4 bg-base-100 hover:bg-base-200"
							onClick={closeProfileModal}
						>
							<X className="w-6 h-6" />
						</Button>
						<PalCard
							profile={selectedPal}
							swipeDirection={null}
							className="mx-auto"
							disableAnimation={true}
						/>
					</div>
				</div>
			)}
		</main>
	);
}
