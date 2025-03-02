import { z } from "zod";

export const signUpSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(18, "First name must be at most 18 characters"),
    last_name: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(18, "Last name must be at most 18 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirm_password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    has_accepted_terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Privacy Policy and Terms of Use",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
