import supabase from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthState {
	user: User| null;
	token: string | null;
	error: string | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	loginAnonymous: () => Promise<void>;
	register: (email: string, password: string) => Promise<User | null>;
	logout: () => Promise<void>;
	getUser: () => Promise<User | null>;
	getToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	error: null,
	loading: false,
	token: null,

	getUser: async () => {
		const { data, error } = await supabase.auth.getSession();
		if (error) {
			console.error(error);
			return null;
		}
		set({ user: data.session?.user || null });
		return data.session?.user || null;
	},

	getToken: async () => {
		const { data, error } = await supabase.auth.getSession();
		if (error) {
			console.error(error);
			return null;
		}
		set({ token: data.session?.access_token || null });
		return data.session?.access_token || null;
	},

	login: async (email: string, password: string) => {
		set({ loading: true, error: null });
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			set({ error: error.message, user: null });
		} else {
			set({ user: data.user, error: null });
            console.log(data.user)
		}
		set({ loading: false });
	},

	register: async (email: string, password: string) => {
		set({ loading: true, error: null });
		const { data, error } = await supabase.auth.signUp({ email, password });
		if (error) {
			set({ error: error.message, user: null });
		} else {
			set({ user: data.user, error: null });

		}
		set({ loading: false });

        return data.user
	},

	logout: async () => {
		await supabase.auth.signOut();
		set({ user: null });
	},

	loginAnonymous: async () => {
		const { data, error } = await supabase.auth.signInAnonymously();

		if (error) {
			set({ error: error.message, user: null });
		} 
	},
}));
