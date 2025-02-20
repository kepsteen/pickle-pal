import { Home, Bell, MessageSquare, UserCog, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router";

export default function GlobalHeader() {
	const [showNotifications, setShowNotifications] = useState(false);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setShowNotifications(false);
			}
		};

		if (showNotifications) {
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [showNotifications]);

	return (
		<header>
			<nav className="p-4">
				<ul className="flex justify-between items-center [&_svg]:w-8 [&_svg]:h-8 container-padding">
					<li>
						<NavLink to="/" className="flex items-center gap-2">
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
						</NavLink>
					</li>
					<li className="[&_svg]:text-primary">
						<ul className="flex justify-between gap-8">
							<li>
								<NavLink
									to="/pair-swipe"
									className={({ isActive }) =>
										`block p-2 ${isActive ? "border-b-4 border-b-primary" : ""}`
									}
								>
									<Users />
								</NavLink>
							</li>
							{/* <li>
								<NavLink
									to="/map"
									className={({ isActive }) =>
										`block p-2 ${isActive ? "border-b-4 border-b-primary" : ""}`
									}
								>
									<MapPinned />
								</NavLink>
							</li> */}
							<li>
								<NavLink
									to="/home"
									className={({ isActive }) =>
										`block p-2 ${isActive ? "border-b-4 border-b-primary" : ""}`
									}
								>
									<Home />
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/pals"
									className={({ isActive }) =>
										`block p-2 ${isActive ? "border-b-4 border-b-primary" : ""}`
									}
								>
									<MessageSquare />
								</NavLink>
							</li>
						</ul>
					</li>
					<div className="flex gap-4 justify-end [&_svg]:text-base-content relative">
						<li>
							<NavLink
								to="/notifications"
								className={({ isActive }) =>
									`block p-2 relative ${
										isActive ? "border-b-4 border-b-base-content" : ""
									}`
								}
							>
								<Bell />
								<span className="absolute w-2 h-2 rounded-full top-1 right-1 bg-primary" />
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/settings"
								className={({ isActive }) =>
									`block p-2 ${
										isActive ? "border-b-4 border-b-base-content" : ""
									}`
								}
							>
								<UserCog />
							</NavLink>
						</li>
					</div>
				</ul>
			</nav>
		</header>
	);
}
