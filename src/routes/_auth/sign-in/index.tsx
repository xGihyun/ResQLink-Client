import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { signInSchema } from "./-schema";
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
import { useState } from "react";
import { toast } from "sonner";
import { SignInRequest } from "./-types";

export const Route = createFileRoute("/_auth/sign-in/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const routeContext = Route.useRouteContext();
	const form = useForm<SignInRequest>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const [isVisible, setIsVisible] = useState(false);

	async function onSubmit(value: SignInRequest) {
		let toastId = toast.loading("Signing in...");

		const result = await routeContext.auth.signIn(value);
		if (result.code !== 200) {
			toast.error(result.message, { id: toastId });
			return;
		}
		toast.success(result.message, { id: toastId });

		navigate({ to: "/status" });
	}

	return (
		<div className="bg-primary-foreground mx-auto mt-12 flex min-h-screen max-w-md flex-col items-center justify-start px-8 py-6">
			{/* Branding */}
			<img src={resqlinkLogoText} className="mx-auto" alt="ResQLink Logo" />
            <h1 className="text-primary font-playfair-display-black">ResQLink</h1>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mt-12 flex h-[60vh] w-full flex-col items-center justify-between"
				>
					<div className="flex w-full flex-col gap-y-5">
						{/* Email Field */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>Email</FormLabel>
									<FormControl>
										<div className="relative flex w-full items-center">
											<img
												src={EmailIcon}
												className="absolute left-3 h-5 w-5 text-gray-400"
												alt="Email Icon"
											/>
											<Input
												placeholder="Email"
												{...field}
												className="bg-input-background min-h-12 pl-10"
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
										<div className="relative flex w-full items-center">
											{/* Left-side Password Icon */}
											<img
												src={PasswordIcon}
												className="absolute left-3 h-5 w-5 text-gray-400"
												alt="Password Icon"
											/>

											{/* Input Field */}
											<Input
												placeholder="Password"
												type={isVisible ? "text" : "password"}
												{...field}
												className="bg-input-background min-h-12 pl-10"
											/>

											{/* Toggle Visibility Button */}
											<button
												type="button"
												className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 right-3 flex h-full w-9 items-center justify-center rounded-e-md transition-all duration-1000 outline-none hover:cursor-pointer focus:z-10"
												onClick={() => setIsVisible((prev) => !prev)}
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

					<div className="min-h-12 w-full">
						<Button type="submit" className="min-h-12 w-full">
							Login
						</Button>

						<p className="text-neutral mx-auto text-center text-sm hover:underline">
							Don't have an account?{" "}
							<Link
								to="/sign-up"
								className="text-primary font-medium underline"
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
