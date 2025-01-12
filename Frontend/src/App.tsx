import { Outlet } from "react-router";

import GlobalHeader from "./components/Header/GlobalHeader/GlobalHeader";

function App() {
	return (
		<>
			<GlobalHeader />
			<Outlet />
			<h1 className="text-red-400">Hello World</h1>
		</>
	);
}

export default App;
