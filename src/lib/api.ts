import { Capacitor } from "@capacitor/core";

export type ApiResponse<T = unknown> = {
	code: number;
	message: string;
	data: T;
};

export function getApiEndpoint(): string {
	if (Capacitor.getPlatform() === "android") {
		return `http://10.0.2.2:3002`;
	}

	return `http://localhost:3002`;
}
