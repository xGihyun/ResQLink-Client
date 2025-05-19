import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/routes/-components/navbar";
import { JSX } from "react";

export const Route = createFileRoute("/_authed/preferences/")({
	component: RouteComponent,
});

function RouteComponent(): JSX.Element {
	const navigate = Route.useNavigate();
	const routeContext = Route.useRouteContext();

	async function handleSignOut(): Promise<void> {
		await routeContext.auth.signOut();
		navigate({ to: "/sign-in" });
	}

	return (
		<div className="bg-background h-svh w-full max-w-3xl">
			<div className="mx-auto flex h-full w-full flex-col gap-6 p-4">
				<div className="inline-flex h-11 flex-col items-start justify-start gap-3">
					<div className="font-playfair-display-black self-stretch text-2xl text-[#5bbea9]">
						User Preferences
					</div>
					<div className="h-[0px] self-stretch border border-[#5bbea9]"></div>
				</div>

				<div className="flex w-full flex-col gap-6">
					{/* Updates Section */}
					<div className="flex flex-col gap-3">
						<div className="font-playfair-display text-lg font-semibold">
							Updates
						</div>

						<div className="flex flex-col gap-2">
							<label className="font-playfair-display text-base font-semibold">
								Status Update Frequency
							</label>
							<Select>
								<SelectTrigger className="w-full rounded-md bg-[#e0e8f3] px-3 py-2">
									<SelectValue placeholder="Every 15 minutes" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="15">Every 15 minutes</SelectItem>
										<SelectItem value="30">Every 30 minutes</SelectItem>
										<SelectItem value="60">Every hour</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex flex-col">
								<span className="font-playfair-display text-base font-semibold">
									Notify Emergency Contacts
								</span>
								<span className="text-muted-foreground text-xs">
									Alert when status changes
								</span>
							</div>
							<Switch />
						</div>
					</div>

					{/* Privacy Section */}
					<div className="flex flex-col gap-3">
						<div className="font-playfair-display text-lg font-semibold">
							Privacy
						</div>

						<div className="flex items-center justify-between">
							<div className="flex flex-col">
								<span className="font-playfair-display text-base font-semibold">
									Share Location
								</span>
								<span className="text-muted-foreground text-xs">
									Visible to rescue teams
								</span>
							</div>
							<Switch />
						</div>
						<div className="rounded-lg bg-[#99b1d6] p-3 text-xs text-white">
							Your location is only shared during emergencies
						</div>
					</div>

					{/* Communication Section */}
					<div className="flex flex-col gap-3">
						<div className="font-playfair-display text-lg font-semibold">
							Communication
						</div>

						<div className="flex items-center justify-between">
							<div className="flex flex-col">
								<span className="font-playfair-display text-base font-semibold">
									Offline Communication
								</span>
								<span className="text-muted-foreground text-xs">
									Use alternative networks
								</span>
							</div>
							<Switch />
						</div>
						<div className="rounded-lg bg-[#ffb74d] p-3 text-xs text-white">
							Ensures connectivity in low-network areas
						</div>
					</div>
				</div>

				<Button onClick={handleSignOut}>Log Out</Button>

				<Navbar />
			</div>
		</div>
	);
}
