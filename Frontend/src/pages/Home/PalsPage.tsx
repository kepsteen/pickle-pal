import { useQuery } from "@tanstack/react-query";
import PalCardCondensed from "../../components/PalCardCondensed/PalCardCondensed";
import { getPals } from "../../lib/api";
import { useAuth } from "../../providers/AuthContextProvider.tsx";
import { useState, useEffect } from "react";
import { ProfileData } from "../../types/user.types.ts";
import { NavLink, useParams } from "react-router";
import { ChevronLeft, EllipsisVerticalIcon } from "lucide-react";
import Label from "../../components/Label/Label.tsx";
import { Input } from "../../components/Input/Input.tsx";
import Button from "../../components/Button/Button.tsx";
import { cn } from "../../lib/utils.ts";
import ChatWindow from "../../components/ChatWindow/ChatWindow.tsx";
// const pals = [
// 	{
// 		palId: "1",
// 		name: "Ben Johns",
// 		imageUrl:
// 			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
// 	},
// 	{
// 		palId: "2",
// 		name: "John Doe",
// 		imageUrl:
// 			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
// 	},
// 	{
// 		palId: "3",
// 		name: "Anna Smith",
// 		imageUrl:
// 			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
// 	},
// 	{
// 		palId: "4",
// 		name: "Riley Johnson",
// 		imageUrl:
// 			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
// 	},
// 	{
// 		palId: "5",
// 		name: "Sam Wilson",
// 		imageUrl:
// 			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
// 	},
// 	{
// 		palId: "6",
// 		name: "Taylor Swift",
// 		imageUrl:
// 			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
// 	},
// 	{
// 		palId: "7",
// 		name: "Chris Evans",
// 		imageUrl:
// 			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
// 	},
// 	{
// 		palId: "8",
// 		name: "Emma Watson",
// 		imageUrl:
// 			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
// 	},
// 	{
// 		palId: "9",
// 		name: "Michael Jordan",
// 		imageUrl:
// 			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
// 	},
// 	{
// 		palId: "10",
// 		name: "Sarah Parker",
// 		imageUrl:
// 			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
// 	},
// 	{
// 		palId: "11",
// 		name: "David Miller",
// 		imageUrl:
// 			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
// 	},
// 	{
// 		palId: "12",
// 		name: "Jessica Alba",
// 		imageUrl:
// 			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
// 	},
// ];

export default function PalsPage() {
	const [pals, setPals] = useState<ProfileData[]>([]);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const { userId } = useParams();
	const { token } = useAuth();

	useEffect(() => {
		setIsChatOpen(!!userId);
	}, [userId]);

	console.log("pals", pals);

	const query = useQuery({
		queryKey: ["pals", token, userId],
		queryFn: async () => {
			if (!token) return [];
			const data = await getPals(token);
			if (data) {
				setPals(data);
			}
			return data ?? [];
		},
		enabled: !!token,
	});

	if (query.isLoading) return <div>Loading...</div>;
	if (query.isError) return <div>Error: {query.error.message}</div>;

	return (
		<div className="flex w-screen py-4 lg:py-10 h-main-content container-padding">
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
								<EllipsisVerticalIcon className="w-6 h-6 text-primary" />
							</div>
						))}
					<ChatWindow />
					<div className="flex items-center gap-2 px-4 py-4 border-t-4 border-t-base-200">
						<Label>
							<Input
								name="message"
								type="text"
								placeholder="Message"
								variant="accent"
								className="border-4 border-base-200"
							/>
						</Label>
						<Button className="p-1">Send</Button>
					</div>
				</section>
			)}
		</div>
	);
}
