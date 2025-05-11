import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/coordination-list/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-w-[300px] max-w-full w-full sm:w-[350px] md:w-[400px] p-4 flex flex-col gap-3">
      <div className="border-b-2 border-primary pb-2">
        <h2 className="text-primary text-lg font-bold font-playfair-display text-left">
          People Needing Assistance
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {data.map((person, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-[#737285]">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-white text-xs font-extrabold font-playfair-display rounded-lg ${
                  person.status === "Danger"
                    ? "bg-[#e57373]"
                    : person.status === "At-Risk"
                    ? "bg-[#ffb74d]"
                    : "bg-[#81c784]"
                }`}
              >
                {person.status}
              </span>
              <span className="text-black text-xs font-medium font-poppins">{person.name}</span>
            </div>
            <span className="text-black text-xs font-poppins">{person.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const data = [
  { status: "Danger", name: "Sarah Chen", time: "11:30 AM" },
  { status: "At-Risk", name: "Sarah Chen", time: "11:30 AM" },
  { status: "At-Risk", name: "Sarah Chen", time: "11:30 AM" },
  { status: "At-Risk", name: "Sarah Chen", time: "11:30 AM" },
  { status: "Safe", name: "Sarah Chen", time: "11:30 AM" },
];

export default RouteComponent;
