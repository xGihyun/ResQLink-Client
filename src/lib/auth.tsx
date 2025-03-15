import {
	createContext,
	JSX,
	ReactNode,
	useContext,
	useState,
	useEffect
} from "react";
import { UserSession, getUserSession, User } from "./user";

export type AuthContextValue = {
	user: User | null;
	validateSession: () => Promise<UserSession | null>;
};

const AuthContext = createContext<AuthContextValue>({
	user: null,
	validateSession: async () => null
});

type AuthProviderProps = {
	children: ReactNode;
};

export function AuthProvider(props: AuthProviderProps): JSX.Element {
	const [user, setUser] = useState<User | null>(null);

	async function validateSession(): Promise<UserSession | null> {
        // TODO: Insert the token stored
		const userSession = await getUserSession("insertTokenHere");

		if (userSession.data === null) {
			console.warn("No session.");
			setUser(null);
			return null;
		}

		setUser(userSession.data.user);
        return userSession.data;
	}

	useEffect(() => {
		validateSession();
	}, []);

	return (
		<AuthContext value={{ user, validateSession }}>
			{props.children}
		</AuthContext>
	);
}

export function useAuth(): AuthContextValue {
	return useContext(AuthContext);
}
