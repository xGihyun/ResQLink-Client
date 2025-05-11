import { z } from "zod";

export const signInAnonymousSchema = z.object({
	firstName: z
		.string()
		.min(2, "First name must be at least 2 characters")
		.max(18, "First name must be at most 18 characters"),
	lastName: z
		.string()
		.min(2, "Last name must be at least 2 characters")
		.max(18, "Last name must be at most 18 characters"),
});

export type SignInAnonymousSchema = z.infer<typeof signInAnonymousSchema>;
