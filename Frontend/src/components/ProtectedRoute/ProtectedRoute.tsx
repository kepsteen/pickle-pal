import { Navigate, useLocation } from "react-router";
import { useAuth } from "@clerk/clerk-react";

export default function ProtectedRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isSignedIn, isLoaded } = useAuth();
	const location = useLocation();

	if (!isLoaded) {
		return <div>Loading...</div>; // Or your loading component
	}

	if (!isSignedIn) {
		// Redirect to login while saving the attempted url
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
