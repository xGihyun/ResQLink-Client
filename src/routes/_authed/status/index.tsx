import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LocationIcon } from "@/assets/icons";
import {
  SentimentWorried,
  SentimentDistressedl,
  SentimentNeutral,
} from "@/assets/icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { format } from "date-fns"; // <-- Import from date-fns

export const Route = createFileRoute("/_authed/status/")({
  component: StatusPage,
});

function StatusPage() {
  const [fullName, setFullName] = useState("Generating Name...");
  const [location, setLocation] = useState("Determining Location...");
  const [status, setStatus] = useState("Analyzing Situation...");
  const [priority, setPriority] = useState("Normal");
  const [reports, setReports] = useState<Report[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  type Report = {
    id: number;
    category: string;
    message: string;
    sentiment: string;
    time: string;
    hasImage: boolean;
  };

  const sentimentIcons: Record<string, string> = {
    Worried: SentimentWorried,
    Distressed: SentimentDistressedl,
    Relieved: SentimentNeutral,
  };

  const badgeColors: Record<string, string> = {
    Danger: "bg-[#E57373] text-white",
    "At Risk": "bg-[#FFB74D] text-white",
    Safe: "bg-[#81C784] text-white",
  };

  const sentimentColors: Record<string, string> = {
    Distressed: "border-[#E57373] text-[#E57373]",
    Worried: "border-[#FFB74D] text-[#FFB74D]",
    Relieved: "border-[#81C784] text-[#81C784]",
  };

  const priorityStyles: Record<string, string> = {
    High: "bg-[#E57373] text-white",
    Medium: "bg-[#FFB74D] text-white",
    Low: "bg-[#81C784] text-white",
  };

  function generateAIContent() {
    const names = [
      "Jam Emmanuel Villarosas",
      "Alexa Smith",
      "John Doe",
      "Maria Clara",
    ];
    const locations = [
      "Building A, Floor 2",
      "Sector 5, Warehouse 3",
      "Apartment 16B",
      "Underground Shelter",
    ];
    const statuses = [
      "Reported being trapped in a collapsed structure. Provided GPS coordinates.",
      "Sent an emergency alert from their mobile device. No further response yet.",
      "Requested medical assistance due to injuries.",
      "Confirmed safe but awaiting evacuation.",
    ];
    const priorities = ["High", "Medium", "Low"];

    setFullName(names[Math.floor(Math.random() * names.length)]);
    setLocation(locations[Math.floor(Math.random() * locations.length)]);
    setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    setPriority(priorities[Math.floor(Math.random() * priorities.length)]);
  }

  function generateReports(): Report[] {
    return [
      {
        id: 1,
        category: "Danger",
        message: "I am hurt under the rubble",
        sentiment: "Distressed",
        time: "1:45 PM",
        hasImage: true,
      },
      {
        id: 2,
        category: "At Risk",
        message: "Building starting to crack",
        sentiment: "Worried",
        time: "10:45 AM",
        hasImage: true,
      },
      {
        id: 3,
        category: "Safe",
        message: "I have evacuated successfully",
        sentiment: "Relieved",
        time: "10:46 AM",
        hasImage: false,
      },
    ];
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      generateAIContent();
      setReports(generateReports());
      setLastUpdate(new Date()); // <-- Set the time here
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-primary-foreground px-8 py-6 mt-12 max-w-md mx-auto">
      <h1 className="w-full text-primary text-2xl font-black font-playfair-display mb-3">
        Victim Status Report
      </h1>
      <div className="w-full border-b border-primary"></div>

      <Card className="w-full bg-transparent mt-6 p-4 flex items-center justify-between">
        <div className="flex flex-col [@media(min-width:425px)]:flex-row items-center gap-4 font-playfair-display w-full">
          <Avatar className="w-12 h-12">
            <AvatarImage src="/path-to-image.jpg" alt={fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="w-full max-w-[250px] text-center [@media(min-width:425px)]:text-left">
            <h2 className="text-lg font-bold">{fullName}</h2>
            <p className="text-sm text-muted-foreground font-poppins ">
              Last update:&nbsp;
              {lastUpdate ? format(lastUpdate, "p") : "Loading..."}
            </p>
          </div>

          {/* Priority badge with dynamic styling */}
          <span
            className={`inline-block rounded-md px-4 py-1 text-sm font-semibold ${
              priorityStyles[priority] || ""
            }`}
          >
            {priority} Priority
          </span>
        </div>
      </Card>

      <div className="w-full mt-6">
        <div className="bg-[#5BBEA9] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <img className="text-lg" src={LocationIcon} />
          <span className="font-medium text-sm">Location: {location}</span>
        </div>

        <div className="text-left">
          <h2 className="text-xl font-bold font-playfair-display mt-4 inline-flex items-center">
            Status Timeline{" "}
            <sup className="text-[10px] font-poppins font-normal text-neutral ml-1 max-w-7/12 ">
              (A.I. Generated Summary 🤖)
            </sup>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground font-poppins mt-2">
          {status}
        </p>
      </div>

      <div className="w-full mt-6">
        <h2 className="text-xl font-bold font-playfair-display mb-3">
          Incident Reports
        </h2>

        <div className="max-h-72 overflow-y-auto space-y-4">
          {reports.map((report) => (
            <Card
              key={report.id}
              className="p-4 flex flex-col gap-2 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <Badge
                  className={`px-3 py-1 rounded-md ${badgeColors[report.category]}`}
                >
                  {report.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {report.time}
                </span>
              </div>

              <p className="text-sm font-medium">{report.message}</p>

              <div className="flex gap-3 flex-col self-center [@media(min-width:375px)]:flex-row ">
                <div
                  className={`border ${sentimentColors[report.sentiment]} flex flex-row text-xs px-3 py-1 rounded-md items-center`}
                >
                  <img
                    src={sentimentIcons[report.sentiment]}
                    className="mx-auto me-2"
                    alt={report.sentiment}
                  />
                  Sentiment: {report.sentiment}
                </div>

                {report.hasImage && (
                  <div className="border border-blue-500 text-blue-500 text-xs px-3 py-1 rounded-md flex items-center gap-1">
                    <Camera className="w-5 h-5 me-1" /> Image Available
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <form className="flex flex-col justify-between items-center h-[60vh] w-full mt-12">
        <Button type="submit" className="w-full mb-2 min-h-12">
          Mark as Responded
        </Button>
      </form>
    </div>
  );
}
