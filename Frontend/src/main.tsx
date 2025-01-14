import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/Auth/LoginPage.tsx";
import SignUpPage from "./pages/Auth/SignUpPage.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import HomePage from "./pages/Home/HomePage.tsx";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />}>
						<Route index element={<LandingPage />} />
						<Route element={<AuthLayout />}>
							<Route path="login" element={<LoginPage />} />
							<Route path="register" element={<SignUpPage />} />
						</Route>
						<Route path="/home" element={<HomePage />} />
					</Route>
				</Routes>
			</BrowserRouter>
			<div id="clerk-captcha" />
		</ClerkProvider>
	</React.StrictMode>
);
