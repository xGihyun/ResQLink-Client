import { createContext, JSX, ReactNode, useContext, useState } from "react";
import { UserSession, getUserSession, User } from "./lib/user";
import { deleteCookie, getCookie, setCookie } from "./lib/cookie";
import { ApiResponse, getApiEndpoint } from "./lib/api";
import { SignInRequest, SignInResponse } from "./routes/_auth/sign-in/-types";
import { SignInAnonymousSchema } from "./routes/_auth/sign-in/anonymous/-schema";
import {
	SignInAnonymousRequest,
	SignInAnonymousResponse,
} from "./routes/_auth/sign-in/anonymous/-types";
import { CapacitorHttp } from "@capacitor/core";

export type AuthContextValue = {
	validateSession: () => Promise<UserSession | null>;
	signOut: () => Promise<void>;
	signIn: (value: SignInRequest) => Promise<ApiResponse<SignInResponse>>;
	signInAnonymous: (
		value: SignInAnonymousSchema,
		id: string,
	) => Promise<ApiResponse<SignInAnonymousResponse>>;
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

		await CapacitorHttp.post({
			url: `${getApiEndpoint()}/api/sign-out`,
			data: {
				token,
				userId: user.id,
			},
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
		const response = await CapacitorHttp.post({
			url: `${getApiEndpoint()}/api/sign-in`,
			data: value,
			headers: {
				"Content-Type": "application/json",
			},
		});
		const result: ApiResponse<SignInResponse> = response.data;

		setCookie("session", result.data.token);

		return result;
	}

	async function signInAnonymous(
		value: SignInAnonymousSchema,
		id: string,
	): Promise<ApiResponse<SignInAnonymousResponse>> {
		const request: SignInAnonymousRequest = {
			anonymousId: id,
		};

		const response = await CapacitorHttp.post({
			url: `${getApiEndpoint()}/api/sign-in/anonymous`,
			data: request,
			headers: {
				"Content-Type": "application/json",
			},
		});
		const result: ApiResponse<SignInAnonymousResponse> = response.data;
		// TODO: Store `anonymousId` and `value` locally

		setCookie("session", result.data.token);

		return result;
	}

	return (
		<AuthContext value={{ validateSession, signOut, signIn, signInAnonymous }}>
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
