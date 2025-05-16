import { ApiResponse } from "./api";

export enum UserRole {
	Citizen = "citizen",
	Responder = "responder",
}

export type User = {
	userId: string;
	createdAt: string;
	updatedAt: string;
	email: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	birthDate: string;
	role: UserRole;
	statusUpdateFrequency: number;
	isLocationShared: boolean;
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
