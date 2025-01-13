import { Outlet, NavLink } from "react-router";

export default function AuthLayout() {
	return (
		<>
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
								<p className="text-2xl font-bold">
									<em>
										<span className="text-primary">Pickle</span> Pal
									</em>
								</p>
							</NavLink>
						</li>
					</ul>
				</nav>
			</header>
			<main className="min-h-[calc(100vh-80px)] grid place-content-center">
				<Outlet />
			</main>
		</>
	);
}
