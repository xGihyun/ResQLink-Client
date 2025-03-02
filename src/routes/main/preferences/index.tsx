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
import { useAuthStore } from "@/store/store.auth";
import { Navbar } from "@/routes/-components/navbar";

export const Route = createFileRoute("/main/preferences/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const auth = useAuthStore();

	return (
		<div className="w-full max-w-md mx-auto p-4 flex flex-col gap-6">
			<div className="h-11 flex-col justify-start items-start gap-3 inline-flex">
				<div className="self-stretch text-[#5bbea9] text-2xl font-black font-playfair-display">
					User Preferences
				</div>
				<div className="self-stretch h-[0px] border border-[#5bbea9]"></div>
			</div>

			<div className="w-full flex flex-col gap-6">
				{/* Updates Section */}
				<div className="flex flex-col gap-3">
					<div className="text-lg font-semibold font-playfair-display">
						Updates
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-base font-semibold font-playfair-display">
							Status Update Frequency
						</label>
						<Select>
							<SelectTrigger className="w-full px-3 py-2 bg-[#e0e8f3] rounded-md">
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

					<div className="flex justify-between items-center">
						<div className="flex flex-col">
							<span className="text-base font-semibold font-playfair-display">
								Notify Emergency Contacts
							</span>
							<span className="text-xs text-muted-foreground">
								Alert when status changes
							</span>
						</div>
						<Switch />
					</div>
				</div>

				{/* Privacy Section */}
				<div className="flex flex-col gap-3">
					<div className="text-lg font-semibold font-playfair-display">
						Privacy
					</div>

					<div className="flex justify-between items-center">
						<div className="flex flex-col">
							<span className="text-base font-semibold font-playfair-display">
								Share Location
							</span>
							<span className="text-xs text-muted-foreground">
								Visible to rescue teams
							</span>
						</div>
						<Switch />
					</div>
					<div className="p-3 bg-[#99b1d6] text-white rounded-lg text-xs">
						Your location is only shared during emergencies
					</div>
				</div>

				{/* Communication Section */}
				<div className="flex flex-col gap-3">
					<div className="text-lg font-semibold font-playfair-display">
						Communication
					</div>

					<div className="flex justify-between items-center">
						<div className="flex flex-col">
							<span className="text-base font-semibold font-playfair-display">
								Offline Communication
							</span>
							<span className="text-xs text-muted-foreground">
								Use alternative networks
							</span>
						</div>
						<Switch />
					</div>
					<div className="p-3 bg-[#ffb74d] text-white rounded-lg text-xs">
						Ensures connectivity in low-network areas
					</div>
				</div>
			</div>

			<Button
				onClick={async () => {
					await auth.logout();
					navigate({ to: "/sign-in" });
				}}
			>
				Log Out
			</Button>

			<Navbar />
		</div>
	);
}

export default RouteComponent;
