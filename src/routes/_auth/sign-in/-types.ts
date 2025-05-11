import { User } from "@/lib/user";
import { signInSchema } from "./-schema";
import { z } from "zod";

export type SignInResponse = {
	user: User;
	token: string;
};

export type SignInRequest = z.infer<typeof signInSchema>;
