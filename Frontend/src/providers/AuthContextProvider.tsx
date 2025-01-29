import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
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
	token: string | null;
};

// Now create the context with a more accurate initial state
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextProviderProps = {
	children: ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
	const [token, setToken] = useState<string | null>(null);

	const { isLoaded, isSignedIn, getToken } = useClerkAuth();
	const { user } = useUser();
	const { session } = useSession();

	useEffect(() => {
		const fetchToken = async () => {
			const token = await getToken();
			setToken(token);
		};
		fetchToken();
	}, [getToken, user]);

	const authValue: AuthContextType = {
		isLoaded,
		isSignedIn: isSignedIn ?? false,
		user: user ?? null,
		session: session ?? null,
		token,
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
