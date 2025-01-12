import { MapPinned, MessageSquare, UserCog, Users } from "lucide-react";
import { NavLink } from "react-router";

export default function GlobalHeader() {
	return (
		<header>
			<nav className="p-4 ">
				<ul className="flex justify-between items-center [&_svg]:w-8 [&_svg]:h-8">
					<li className="">
						<NavLink to="">
							<div className="w-20 h-20">
								<img
									src="/pickle-pal-icon.svg"
									alt="pickle pal logo"
									className="w-full h-full"
								/>
							</div>
						</NavLink>
					</li>
					<li className="[&_svg]:text-primary">
						<ul className="flex justify-between gap-8">
							<li>
								<NavLink
									to="/pals"
									className={({ isActive }) =>
										isActive ? "border border-b-primary" : ""
									}
								>
									<Users />
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/map"
									className={({ isActive }) =>
										isActive ? "border border-b-primary" : ""
									}
								>
									<MapPinned />
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/messages"
									className={({ isActive }) =>
										isActive ? "border border-b-primary" : ""
									}
								>
									<MessageSquare />
								</NavLink>
							</li>
						</ul>
					</li>

					<li className="flex justify-end [&_svg]:text-base-content">
						<NavLink
							to="/settings"
							className={({ isActive }) =>
								isActive ? "border border-b-base-content" : ""
							}
						>
							<UserCog />
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
}
