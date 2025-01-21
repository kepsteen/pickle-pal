import GlobalHeader from "../components/Headers/GlobalHeader/GlobalHeader";
import { Outlet } from "react-router";

export default function HomeLayout() {
	return (
		<>
			<GlobalHeader />
			<main className="flex flex-col items-center justify-center min-h-main-content container-padding">
				<Outlet />
			</main>
		</>
	);
}
