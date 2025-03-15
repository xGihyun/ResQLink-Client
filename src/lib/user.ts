import { ApiResponse } from "./api";

export enum UserRole {
	Player = "player",
	Admin = "admin",
}

export type User = {
	userId: string;
	createdAt: string;
	username: string;
	name: string;
	role: UserRole;
	avatarUrl?: string;
};

type Session = {
	sessionId: string;
	userId: string;
	expiresAt: string;
};

export type UserSession = {
	user: User;
	session: Session;
};

export async function getUserSession(
	token: string,
): Promise<ApiResponse<UserSession | null>> {
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/session?token=${token}`,
	);

	const result: ApiResponse<UserSession> = await response.json();

	return result;
}
