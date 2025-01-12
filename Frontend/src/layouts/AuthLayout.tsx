import { Outlet } from "react-router";

export default function AuthLayout() {
	return (
		<main className="min-h-[calc(100vh-80px)] grid place-content-center">
			<Outlet />
		</main>
	);
}
