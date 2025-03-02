import { create } from "zustand/react"

interface InferenceState {
  inferenceResult: any;
  loading: boolean;
  error: string | null;
  fetchInference: (params: {
    image: Blob;
    user_situation: string;
    user_id: string;
    token: string;
  }) => Promise<void>;
}

export const useInferenceStore = create<InferenceState>((set) => ({
  inferenceResult: null,
  loading: false,
  error: null,
  fetchInference: async ({ image, user_situation, user_id, token }) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("image", image, "image.jpg");
      formData.append("user_situation", user_situation);
      formData.append("user_id", user_id);

      const response = await fetch(
        // @ts-ignore
        import.meta.env.VITE_DJANGO_URL + "api/v1/infer-image/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const data = await response.json();
      set({ inferenceResult: data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));
