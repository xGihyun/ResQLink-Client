import {
	createContext,
	JSX,
	ReactNode,
	useContext,
	useState,
	useEffect,
} from "react";
import { UserSession, getUserSession, User } from "./lib/user";
import { deleteCookie, getCookie, setCookie } from "./lib/cookie";
import { ApiResponse } from "./lib/api";
import { SignInRequest, SignInResponse } from "./routes/_auth/sign-in/-types";

export type AuthContextValue = {
	user: User | null;
	validateSession: () => Promise<UserSession | null>;
	signOut: () => Promise<void>;
	signIn: (value: SignInRequest) => Promise<ApiResponse<SignInResponse>>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
	children: ReactNode;
};

export function AuthProvider(props: AuthProviderProps): JSX.Element {
	const [user, setUser] = useState<User | null>(null);

	async function validateSession(): Promise<UserSession | null> {
		// TODO: Get token depending on the user's platform (web/android)
		const token = getCookie("session");
		if (!token) {
			return null;
		}

		const userSession = await getUserSession(token);
		if (userSession.data === null) {
			setUser(null);
			return null;
		}

		setUser(userSession.data.user);
		return userSession.data;
	}

	async function signOut(): Promise<void> {
		const token = getCookie("session");
		if (!token || !user) {
			return;
		}

		await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sign-out`, {
			method: "POST",
			body: JSON.stringify({
				token,
				userId: user.userId,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		setUser(null);
		deleteCookie("session");
	}

	async function signIn(
		value: SignInRequest,
	): Promise<ApiResponse<SignInResponse>> {
		const response = await fetch(
			`${import.meta.env.VITE_BACKEND_URL}/api/sign-in`,
			{
				method: "POST",
				body: JSON.stringify(value),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		const result: ApiResponse<SignInResponse> = await response.json();

		setCookie("session", result.data.token);

		return result;
	}

	return (
		<AuthContext value={{ user, validateSession, signOut, signIn }}>
			{props.children}
		</AuthContext>
	);
}

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}
