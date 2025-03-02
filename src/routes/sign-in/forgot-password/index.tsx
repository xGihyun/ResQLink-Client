/* ================================
  Used Generative AI: ChatGPT o3-mini-high
   ================================ */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmailIcon } from "@/assets/icons/";
import { resqlinkLogoText } from "@/assets/logos";

// Zod schema: only needs a valid email for password reset
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

// Create a route at /forgot-password
export const Route = createFileRoute("/sign-in/forgot-password/")({
  component: ForgotPasswordRoute,
});

function ForgotPasswordRoute() {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordSchema) {
    console.log("Forgot password form submitted:", values);
    // Insert your "forgot password" logic here (e.g., call an API to send reset email)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-primary-foreground px-8 py-6 mt-12 max-w-md mx-auto">
      {/* Branding */}
      <img src={resqlinkLogoText} className="mx-auto" alt="ResQLink Logo" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-between items-center h-[60vh] w-full mt-12"
        >
          <div className="flex flex-col gap-y-5 w-full">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center w-full">
                      <img
                        src={EmailIcon}
                        className="absolute left-3 w-5 h-5 text-gray-400"
                        alt="Email Icon"
                      />
                      <Input
                        placeholder="Email"
                        {...field}
                        className="pl-10 min-h-12 bg-input-background"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-neutral mx-auto text-sm font-medium hover:underline ">
              <Link to="/sign-in">
                Remembered your password?{" "}
                <span className="underline text-primary">Log In</span>
              </Link>
            </p>
          </div>

          <div>
            {/* Reset Password Button */}
            <Button
              type="submit"
              className="w-full mb-3 hover:cursor-pointer min-h-12"
            >
              Reset Password
            </Button>

            <p className="text-center text-sm text-neutral mx-auto">
              Don&apos;t have an account?{" "}
              <Link
                to="/sign-up"
                className="underline text-primary font-medium"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
