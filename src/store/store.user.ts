import { User } from "@/lib/user";
import { create } from "zustand/react";

type UserState = {
	user: User | null;
	setUser: (request: User) => void;
};

export const useUserStore = create<UserState>((set, get) => {
	function setUser(request: User): void {
		set({ user: request });
	}

	return {
		setUser: setUser,
		user: null,
	};
});
