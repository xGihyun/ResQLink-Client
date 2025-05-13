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

		navigate({ to: "/report" });
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mt-12 flex h-full w-full flex-col items-center justify-between gap-4"
			>
				<div className="w-full space-y-4">
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
											className="absolute left-3 h-5 w-5"
											alt="Email Icon"
										/>
										<Input
											placeholder="Email"
											{...field}
											className="min-h-12 pl-10"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Password</FormLabel>
								<FormControl>
									<div className="relative flex w-full items-center">
										<img
											src={PasswordIcon}
											className="absolute left-3 h-5 w-5"
											alt="Password Icon"
										/>

										<Input
											placeholder="Password"
											type={isVisible ? "text" : "password"}
											{...field}
											className="min-h-12 pl-10"
										/>

										<button
											type="button"
											className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 right-3 flex h-full w-9 items-center justify-center rounded-e-md transition-all duration-1000 outline-none hover:cursor-pointer focus:z-10"
											onClick={() => setIsVisible((prev) => !prev)}
											aria-label={isVisible ? "Hide password" : "Show password"}
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

					<div className="w-full text-center">
						<Link
							to="/sign-in/forgot-password"
							className="text-sm hover:underline"
						>
							Forgot your password?
						</Link>
					</div>
				</div>

				<div className="min-h-12 w-full space-y-4">
					<Button type="submit" className="font-poppins-bold min-h-12 w-full">
						Sign In
					</Button>

					<p className="text-primary text-center text-sm">
						Don't have an account?{" "}
						<Link to="/sign-up" className="font-medium underline">
							Sign Up
						</Link>
					</p>
				</div>
			</form>
		</Form>
	);
}
