import { createContext, ReactNode, useContext } from "react";
import {
	useAuth as useClerkAuth,
	useSession,
	useUser,
} from "@clerk/clerk-react";
import { ActiveSessionResource, UserResource } from "@clerk/types";

// First, let's type what our context will contain
type AuthContextType = {
	user: UserResource | null;
	session: ActiveSessionResource | null;
	isSignedIn: boolean | undefined;
	isLoaded: boolean;
};

// Now create the context with a more accurate initial state
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextProviderProps = {
	children: ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
	const { isLoaded, isSignedIn } = useClerkAuth();
	const { user } = useUser();
	const { session } = useSession();

	const authValue: AuthContextType = {
		isLoaded,
		isSignedIn: isSignedIn ?? false,
		user: user ?? null,
		session: session ?? null,
	};

	return (
		<AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
	);
}

// Add this custom hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthContextProvider");
	}
	return context;
};