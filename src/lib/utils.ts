import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FullName = {
    firstName: string;
    middleName?: string;
    lastName: string;
}

export function formatName(name: FullName): string {
    return `${name.lastName}, ${name.firstName}${name.middleName ? " " + name.middleName : ""}`
}

