/**
 * @file store.citizens.ts
 * 
 * @brief Manages citizen reports using Supabase and Zustand.
 * 
 * This module handles operations related to citizen reports including fetching priority cases,
 * retrieving all cases, and marking a case as responded. The file leverages Supabase for database
 * interactions and Zustand for state management.
 * 
 * Special thanks to GPT o3 mini for assisting in the development of this file, enhancing both its
 * clarity and functionality.
 *
 * @module store
 */

import supabase from "@/lib/supabase";
import { create } from "zustand/react";

type CitizenReport = {
  victim_report_id: string;
  created_at: string;
  status: "safe" | "at_risk" | "in_danger";
  situation: string;
  photo_evidence_url: string;
  full_situation: string;
  responded_at: string;
  user_id: string;
  user_near: string;
  lat: number;
  long: number;
  distressed: boolean;
};

interface CitizensState {
  priority_cases: CitizenReport[];
  all_cases: CitizenReport[];
  getPriorityCases: () => Promise<CitizenReport[]>;
  getAllCases: () => Promise<CitizenReport[]>;
  markCaseAsResponded: (victim_report_id: string) => Promise<void>;
}

export const useCitizensStore = create<CitizensState>((set) => ({
  priority_cases: [],
  all_cases: [],

  getPriorityCases: async () => {
    const { data, error } = await supabase
      .from("victim_reports")
      .select("*")
      .eq("status", "in_danger")
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Error fetching priority cases:", error);
      return [];
    }
    set({ priority_cases: data as CitizenReport[] });
    return data as CitizenReport[];
  },

  getAllCases: async () => {
    const { data, error } = await supabase.from("victim_reports").select("*");
    if (error) {
      console.error("Error fetching all cases:", error);
      return [];
    }
    set({ all_cases: data as CitizenReport[] });
    return data as CitizenReport[];
  },

  markCaseAsResponded: async (victim_report_id: string) => {
    const updatedAt = new Date().toISOString();
    const { error } = await supabase
      .from("victim_reports")
      .update({ responded_at: updatedAt })
      .match({ victim_report_id });
    if (error) {
      console.error("Error marking case as responded:", error);
      return;
    }
    set((state) => ({
      all_cases: state.all_cases.map((c) =>
        c.victim_report_id === victim_report_id
          ? { ...c, responded_at: updatedAt }
          : c
      ),
    }));
  },
}));
