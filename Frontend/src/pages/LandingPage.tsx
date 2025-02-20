import { MessageSquare, Users } from "lucide-react";
import { NavLink } from "react-router";

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="p-6 text-center rounded-lg bg-base-200 outline outline-1 outline-primary-content ">
			<div className="flex justify-center mb-4">{icon}</div>
			<h3 className="mb-2 text-xl font-semibold">{title}</h3>
			<p className="text-gray-400">{description}</p>
		</div>
	);
}

export default function LandingPage() {
	return (
		<>
			<div className="flex flex-col justify-between h-screen text-white bg-base-100">
				<header className="flex items-center gap-2 pt-12 container-padding">
					<div className="w-12 h-12">
						<img
							src="/pickle-pal-icon.svg"
							alt="pickle pal logo"
							className="w-full h-full"
						/>
					</div>
					<h2 className="hidden text-2xl font-bold sm:block">
						<em>
							<span className="text-primary">Pickle</span> Pal
						</em>
					</h2>
				</header>
				<main>
					<section className="py-20">
						<div className="container px-4 mx-auto text-center">
							<h1 className="mb-6 text-4xl font-bold md:text-6xl">
								Find Your Perfect{" "}
								<span className="text-primary">Pickleball Partner</span>
							</h1>
							<p className="mb-8 text-xl text-gray-400">
								Connect with players, schedule matches, and elevate your game.
							</p>
							<NavLink
								to="/login"
								className="inline-block px-8 py-3 text-lg font-semibold transition-colors rounded-md bg-primary text-base-200 hover:bg-primary/90"
							>
								Find Pals Now
							</NavLink>
						</div>
					</section>

					<section className="py-20">
						<div className="container px-4 mx-auto">
							<h2 className="mb-12 text-3xl font-bold text-center">
								Why Choose PicklePal?
							</h2>
							<div className="grid gap-12 md:grid-cols-2">
								<FeatureCard
									icon={<Users className="w-12 h-12 text-primary" />}
									title="Player Matching"
									description="Find players that match your skill level and playing style."
								/>
								<FeatureCard
									icon={<MessageSquare className="w-12 h-12 text-primary" />}
									title="Easy Communication"
									description="Chat with potential partners and coordinate game times."
								/>
							</div>
						</div>
					</section>
				</main>

				<footer className="py-8 border-t border-gray-800">
					<div className="container px-4 mx-auto text-center text-gray-400">
						<p>
							&copy; {new Date().getFullYear()} PicklePal. All rights reserved.
						</p>
					</div>
				</footer>
			</div>
		</>
	);
}
