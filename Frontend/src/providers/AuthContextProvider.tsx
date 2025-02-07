import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
	useCallback,
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
	isSignedIn: boolean;
	isLoaded: boolean;
	token: string | null;
	// Add optional methods that might be useful
	refreshToken?: () => Promise<void>;
};

// Now create the context with a more accurate initial state
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextProviderProps = {
	children: ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
	const [token, setToken] = useState<string | null>(null);
	const [isLoadingToken, setIsLoadingToken] = useState(true);

	const { isLoaded, isSignedIn, getToken } = useClerkAuth();
	const { user } = useUser();
	const { session } = useSession();

	const fetchToken = useCallback(async () => {
		try {
			setIsLoadingToken(true);
			if (isSignedIn) {
				const newToken = await getToken();
				setToken(newToken);
			} else {
				setToken(null);
			}
		} catch (error) {
			console.error("Error fetching token:", error);
			setToken(null);
		} finally {
			setIsLoadingToken(false);
		}
	}, [getToken, isSignedIn]);

	useEffect(() => {
		fetchToken();
	}, [fetchToken]);

	const refreshToken = useCallback(async () => {
		await fetchToken();
	}, [fetchToken]);

	const authValue: AuthContextType = {
		isLoaded: isLoaded && !isLoadingToken,
		isSignedIn: isSignedIn ?? false,
		user: user ?? null,
		session: session ?? null,
		token,
		refreshToken,
	};

	if (!isLoaded || isLoadingToken) {
		return null;
	}

	return (
		<AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
	);
}

// Custom hook to use the AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthContextProvider");
	}
	return context;
};
