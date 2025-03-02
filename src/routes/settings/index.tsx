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

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (

    <div className="w-full max-w-xl mx-auto p-4 py-8 bg-background text-foreground">
      <div className="flex flex-col gap-9">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h1 className="text-primary text-2xl sm:text-3xl font-black font-playfair-display">
            Communication Settings
          </h1>
          <div className="border border-primary" />
        </div>

        {/* Status Update Frequency Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-foreground text-base font-semibold font-playfair-display">
            Status Update Frequency
          </h2>
          <div className="p-3 bg-primary rounded-lg">
            <p className="text-primary-foreground text-xs font-normal font-['Poppins']">
              How often should we check on you during an active disaster?
            </p>
          </div>
          <Select >
              <SelectTrigger className="min-h-12 w-full px-3 py-2 bg-[#e0e8f3] rounded-md">
                <SelectValue placeholder="Every 15 minutes" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every 1 hour</SelectItem>
                  <SelectItem value="120">Every 2 hours</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
        </div>

        {/* Location Visibility Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-foreground text-base font-semibold font-playfair-display">
            Location Visibility
          </h2>
          <div className="p-3 bg-primary rounded-lg">
            <p className="text-primary-foreground text-xs font-normal font-['Poppins']">
              Allow non-rescue personnel to see your location during emergencies
            </p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-foreground text-base font-semibold font-playfair-display">
                Share Location
              </span>
              <span className="text-foreground text-xs font-light font-['Poppins']">
                Visible to trusted contacts
              </span>
            </div>
            <Switch className="hover:cursor-pointer" id="share-location" />
          </div>
        </div>

        {/* Offline Mode Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-foreground text-base font-semibold font-playfair-display">
            Offline Mode
          </h2>
          <div className="p-3 bg-primary rounded-lg">
            <p className="text-primary-foreground text-xs font-normal font-['Poppins']">
              Enable mesh network communication when internet is unavailable
            </p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-foreground text-base font-semibold font-playfair-display">
                Offline Communication
              </span>
              <span className="text-foreground text-xs font-light font-['Poppins']">
                Uses Bluetooth & local network
              </span>
            </div>
            <Switch
              className="hover:cursor-pointer"
              id="offline-communication"
            />
          </div>
        </div>

        {/* Save Settings Button */}
        <Button className="w-full min-h-12 bg-[#6F7EC6] rounded-lg py-2 hover:cursor-pointer mt-auto">
          <span className="text-white text-center text-sm font-semibold  capitalize">
            Save Settings
          </span>
        </Button>
      </div>
    </div>
  );
}
