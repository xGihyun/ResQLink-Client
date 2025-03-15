import { z } from "zod";

export const anonymousSignUpSchema = z.object({
	first_name: z
		.string()
		.min(2, "First name must be at least 2 characters")
		.max(18, "First name must be at most 18 characters"),
	last_name: z
		.string()
		.min(2, "Last name must be at least 2 characters")
		.max(18, "Last name must be at most 18 characters"),
});

export type AnonymousSignUpSchema = z.infer<typeof anonymousSignUpSchema>;
