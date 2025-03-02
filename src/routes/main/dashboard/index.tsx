import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  X,
} from "lucide-react";
import { useInferenceStore } from "@/store/store.inference";
import { useAuthStore } from "@/store/store.auth";

export const Route = createFileRoute("/main/dashboard/")({
  component: RouteComponent,
});

const statusSchema = z.object({
  status: z.enum(["safe", "atRisk", "inDanger"], {
    required_error: "Please select a status",
  }),
  description: z.string().min(10, "Description must be at least 10 characters"),
  photo: z.any(),
});

function RouteComponent() {
  const [showModal, setShowModal] = useState(false);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  const inference = useInferenceStore();
  const auth = useAuthStore();

  useEffect(() => {
    auth.getUser();
    auth.getToken();
  }, []);

  const form = useForm<z.infer<typeof statusSchema>>({
    resolver: zodResolver(statusSchema),
    defaultValues: { status: undefined, description: "", photo: "" },
  });

  const onSubmit = async (data: z.infer<typeof statusSchema>) => {
    console.log("Form Data:", data);
    setShowModal(true);

    if (auth.user && auth.token) {
      await inference.fetchInference({
        image: data.photo as Blob,
        user_situation: data.description,
        user_id: auth.user.id,
        token: auth.token,
      });
    }

    setTimeout(() => setShowModal(false), 2000); // Auto-hide modal after 2 sec
  };

  // Status options configuration.
  const statusOptions = [
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
  ];

  const handleTakePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
      });
      const photoUrl = photo.webPath || null;
      setPhotoSrc(photoUrl);
      if (photoUrl) {
        form.setValue("photo", photoUrl);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const handleUploadImage = async () => {
    try {
      const result = await FilePicker.pickImages();
      if (result.files && result.files.length > 0) {
        const fileBlob = result.files[0].blob!;
        const objectUrl = URL.createObjectURL(fileBlob);
        setPhotoSrc(objectUrl);
        form.setValue("photo", fileBlob);
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  return (
    <div className="w-full min-w-[300px] max-w-md mx-auto h-screen flex flex-col justify-start items-center gap-6 p-4">
      <div className="w-full flex flex-col gap-3">
        <div className="text-[#5bbea9] text-2xl font-black font-playfair-display text-left">
          Emergency Status Update
        </div>
        <div className="border border-[#5bbea9]"></div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          <div className="w-full text-black text-base font-semibold font-playfair-display text-left mb-2">
            How are You?
          </div>

          {/* Status Selection */}
          <FormField
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="w-full flex flex-col gap-3">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={`w-full px-3 py-4 rounded-lg flex justify-between items-center gap-3 transition-all duration-300 ${
                        field.value === option.value
                          ? `${option.selectedColor} border-4 border-white scale-105`
                          : `${option.color} border-transparent`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {option.icon}
                        <div className="flex flex-col justify-start items-start gap-[3px]">
                          <div className="text-white text-xl font-black font-playfair-display">
                            {option.label}
                          </div>
                          <div className="text-white text-sm font-medium font-['Poppins']">
                            {option.desc}
                          </div>
                          <div className="text-white text-xs font-normal font-['Poppins']">
                            {option.checkIn}
                          </div>
                        </div>
                      </div>
                      {field.value === option.value && (
                        <CheckCircle className="text-white" />
                      )}
                    </button>
                  ))}
                </div>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Description field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <FormItem className="w-full flex flex-col gap-3">
                <FormLabel className="text-black text-base font-semibold font-playfair-display">
                  Describe Your Situation
                </FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Photo Evidence Section */}
          <div className="w-full flex flex-col gap-3">
            <div className="text-black text-base font-semibold font-playfair-display">
              Add Photo Evidence
            </div>
            <div className="w-full flex flex-col gap-2">
              <button
                type="button"
                onClick={handleTakePhoto}
                className="w-full min-h-12 bg-[#5bbea9] rounded-lg text-white text-sm font-bold font-['Poppins']"
              >
                Take Photo
              </button>
              <button
                type="button"
                onClick={handleUploadImage}
                className="w-full min-h-12 bg-[#6f7ec6] rounded-lg text-white text-sm font-bold font-['Poppins']"
              >
                Upload Image
              </button>
            </div>
            {photoSrc && (
              <div className="mt-4">
                <img
                  src={photoSrc}
                  alt="Photo Evidence"
                  className="w-full h-auto rounded-md"
                />
              </div>
            )}
            {/* Optional: Display error message for photo field */}
            <FormField
              control={form.control}
              name="photo"
              render={({ fieldState }) => (
                <FormItem>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 bg-[#5bbea9] rounded-lg text-white text-sm font-bold font-['Poppins']"
          >
            Submit Update
          </button>
        </form>
      </Form>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
            <CheckCircle className="text-green-500 w-12 h-12" />
            <p className="text-lg font-semibold font-playfair-display text-gray-800">
              Status Submitted Successfully!
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RouteComponent;
