import { Outlet } from "react-router";
import Header from "./components/Header/Header";

function App() {
	return (
		<>
			<Header />
			<Outlet />
			<h1 className="text-red-400">Hello World</h1>
		</>
	);
}

export default App;
