import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ShieldCheck, AlertTriangle, ShieldAlert, X } from "lucide-react";
import { Navbar } from "../-components/navbar";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

const statusSchema = z.object({
  status: z.enum(["safe", "atRisk", "inDanger"], {
    required_error: "Please select a status",
  }),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

function RouteComponent() {
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(statusSchema),
  });

  const selectedStatus = watch("status");

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000); // Auto-hide modal after 2 sec
  };

  return (
    <div className="w-full min-w-[300px] max-w-md mx-auto h-screen flex flex-col justify-start items-center gap-6 p-4 pb-20">
      <div className="w-full flex flex-col gap-3">
        <div className="text-[#5bbea9] text-2xl font-black font-playfair-display text-left">
          Emergency Status Update
        </div>
        <div className="border border-[#5bbea9]"></div>
      </div>

      <div className="w-full p-3 bg-[#99b1d6] rounded-lg text-white text-sm font-semibold font-['Poppins'] text-left">
        Next update due in: 12 minutes
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
        <div className="w-full text-black text-base font-semibold font-playfair-display text-left mb-2">
          How are You?
        </div>

        <div className="w-full flex flex-col gap-3">
          {[
            {
              label: "Safe",
              value: "safe",
              color: "bg-[#81c784]",
              selectedColor: "bg-[#66bb6a]",
              desc: "I am safe and well",
              checkIn: "Check-ins every 24 hours",
              icon: <ShieldCheck className="text-white" />,
            },
            {
              label: "At Risk",
              value: "atRisk",
              color: "bg-[#ffb74d]",
              selectedColor: "bg-[#f57c00]",
              desc: "I may need assistance soon",
              checkIn: "Check-ins every 8 hours",
              icon: <AlertTriangle className="text-white" />,
            },
            {
              label: "In Danger",
              value: "inDanger",
              color: "bg-[#e57373]",
              selectedColor: "bg-[#d32f2f]",
              desc: "I need immediate help",
              checkIn: "Check-ins every hour",
              icon: <ShieldAlert className="text-white" />,
            },
          ].map(({ label, value, color, selectedColor, desc, checkIn, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue("status", value)}
              className={`w-full px-3 py-4 rounded-lg flex justify-between items-center gap-3 transition-all duration-300 ${
                selectedStatus === value ? `${selectedColor} border-4 border-white scale-105` : `${color} border-transparent`
              }`}
            >
              <div className="flex items-center gap-3">
                {icon}
                <div className="flex flex-col justify-start items-start gap-[3px]">
                  <div className="text-white text-xl font-black font-playfair-display">{label}</div>
                  <div className="text-white text-sm font-medium font-['Poppins']">{desc}</div>
                  <div className="text-white text-xs font-normal font-['Poppins']">{checkIn}</div>
                </div>
              </div>
              {selectedStatus === value && <CheckCircle className="text-white" />}
            </button>
          ))}
          {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="text-black text-base font-semibold font-playfair-display">
            Describe Your Situation
          </div>
          <Textarea {...register("description")} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="text-black text-base font-semibold font-playfair-display">
            Add Photo Evidence
          </div>
          <div className="w-full flex flex-col gap-2">
            <button className="w-full min-h-12 bg-[#5bbea9] rounded-lg text-white text-sm font-bold font-['Poppins']">
              Take Photo
            </button>
            <button className="w-full min-h-12 bg-[#6f7ec6] rounded-lg text-white text-sm font-bold font-['Poppins']">
              Upload Image
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-3 bg-[#5bbea9] rounded-lg text-white text-sm font-bold font-['Poppins']"
        >
          Submit Update
        </button>
      </form>

      <Navbar />

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
            <CheckCircle className="text-green-500 w-12 h-12" />
            <p className="text-lg font-semibold font-playfair-display text-gray-800">Status Submitted Successfully!</p>
            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
