import { Outlet, Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/Auth/LoginPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import OnboardingPage from "./pages/Onboarding/OnboardingPage.tsx";
import HomeLayout from "./layouts/HomeLayout.tsx";
import HomePage from "./pages/Home/HomePage.tsx";
import { AuthContextProvider } from "./providers/AuthContextProvider";
import MessagesPage from "./pages/Home/MessagesPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";

function App() {
	return (
		<AuthContextProvider>
			<Routes>
				<Route path="/" element={<Outlet />}>
					<Route index element={<LandingPage />} />
					<Route element={<AuthLayout />}>
						<Route path="login" element={<LoginPage />} />
						<Route path="register" element={<SignUpPage />} />
						<Route
							path="onboarding"
							element={
								<ProtectedRoute>
									<OnboardingPage isEditing={false} />
								</ProtectedRoute>
							}
						/>
					</Route>
					<Route
						element={
							<ProtectedRoute>
								<HomeLayout />
							</ProtectedRoute>
						}
					>
						<Route path="home" element={<HomePage />} />
						<Route path="messages" element={<MessagesPage />} />
						{/* messages page */}
						{/* map page */}
					</Route>
				</Route>
			</Routes>
		</AuthContextProvider>
	);
}

export default App;
