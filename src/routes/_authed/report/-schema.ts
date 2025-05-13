import { z } from "zod";
import { CitizenStatus } from "./-types";

export const statusSchema = z.object({
	status: z.nativeEnum(CitizenStatus, {
		required_error: "Please select a status",
	}),
	description: z.string().min(10, "Description must be at least 10 characters"),
	photo: z.any(),
});

export type StatusSchema = z.infer<typeof statusSchema>;
