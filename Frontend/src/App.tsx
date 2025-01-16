import { Outlet, Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/Auth/LoginPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import HomePage from "./pages/Home/HomePage";
import OnboardingPage from "./pages/OnboardingPage";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Outlet />}>
					<Route index element={<LandingPage />} />
					<Route element={<AuthLayout />}>
						<Route path="login" element={<LoginPage />} />
						<Route path="register" element={<SignUpPage />} />
						<Route
							path="/onboarding"
							element={<OnboardingPage isEditing={false} />}
						/>
					</Route>
					<Route path="/home" element={<HomePage />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
