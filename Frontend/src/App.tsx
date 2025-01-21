import { Outlet, Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/Auth/LoginPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import OnboardingPage from "./pages/Onboarding/OnboardingPage.tsx";
import HomeLayout from "./layouts/HomeLayout.tsx";
import HomePage from "./pages/Home/HomePage.tsx";

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
							path="onboarding"
							element={<OnboardingPage isEditing={false} />}
						/>
					</Route>
					<Route element={<HomeLayout />}>
						<Route path="home" element={<HomePage />} />
						{/* messages page */}
						{/* map page */}
					</Route>
				</Route>
			</Routes>
		</>
	);
}

export default App;
