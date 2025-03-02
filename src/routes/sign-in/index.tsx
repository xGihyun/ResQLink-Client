import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { signInSchema, SignInSchema } from "./-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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
import { resqlinkLogoText } from "@/assets/logos";
import { EmailIcon } from "@/assets/icons/";
import { PasswordIcon } from "@/assets/icons/";
import { useAuthStore } from "@/store/store.auth";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/sign-in/")({
  component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const form = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const auth = useAuthStore();

	// State for toggling password visibility
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisibility = () => setIsVisible((prev) => !prev);

	async function onSubmit(values: SignInSchema) {
		let toastId = toast.loading("Logging in...");

		await auth.login(values.email, values.password);

		if (auth.error) {
			toast.error(auth.error, { id: toastId });
			console.error(auth.error);
			return;
		}

		toast.success("Welcome to ResQLink!", { id: toastId });

		navigate({ to: "/main/map" });
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

						{/* Password Field with Toggle Visibility */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>Password</FormLabel>
									<FormControl>
										<div className="relative flex items-center w-full">
											{/* Left-side Password Icon */}
											<img
												src={PasswordIcon}
												className="absolute left-3 w-5 h-5 text-gray-400"
												alt="Password Icon"
											/>

											{/* Input Field */}
											<Input
												placeholder="Password"
												type={isVisible ? "text" : "password"}
												{...field}
												className="pl-10 min-h-12 bg-input-background"
											/>

											{/* Toggle Visibility Button */}
											<button
												type="button"
												className="absolute transition-all duration-1000 inset-y-0 right-3 flex hover:cursor-pointer h-full w-9 items-center justify-center text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 rounded-e-md outline-none focus:z-10"
												onClick={toggleVisibility}
												aria-label={
													isVisible ? "Hide password" : "Show password"
												}
												aria-pressed={isVisible}
											>
												{isVisible ? (
													<EyeIcon size={18} aria-hidden="true" />
												) : (
													<EyeOffIcon size={18} aria-hidden="true" />
												)}
											</button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<p className="text-neutral mx-auto text-sm font-medium hover:underline">
							<Link to="/sign-in/forgot-password">Forgot your password?</Link>
						</p>
					</div>

					<div className="w-full min-h-12">
						<Button type="submit" className="w-full min-h-12">
							Login
						</Button>

						<p className="text-center text-sm text-neutral mx-auto hover:underline">
							Don't have an account?{" "}
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
