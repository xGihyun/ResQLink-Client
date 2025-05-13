import { z } from "zod";
import { CitizenStatus } from "./-types";

export const reportSchema = z.object({
	userId: z.string(),
	status: z.nativeEnum(CitizenStatus, {
		required_error: "Please select a status",
	}),
	rawSituation: z.string().min(4, "Description must be at least 4 characters"),
	photos: z.any(),
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(18, "Name must be at most 18 characters"),
});

export type ReportSchema = z.infer<typeof reportSchema>;
