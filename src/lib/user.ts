import { CapacitorHttp } from "@capacitor/core";
import { ApiResponse } from "./api";

export enum UserRole {
	Citizen = "citizen",
	Responder = "responder",
}

export type User = {
	id: string;
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
	id: string;
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
	const response = await CapacitorHttp.get({
		url: `${import.meta.env.VITE_BACKEND_URL}/api/session?token=${token}`,
	});

    console.log(response)

	const result: ApiResponse<UserSession> = response.data;

	return result;
}
