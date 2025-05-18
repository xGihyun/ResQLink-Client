import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FullName = {
	firstName: string;
	middleName?: string;
	lastName: string;
};

export function formatName(name: FullName): string {
	return `${name.lastName}, ${name.firstName}${name.middleName ? " " + name.middleName : ""}`;
}

export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string); // This will be a Data URL (e.g., "data:image/png;base64,...")
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

async function formDataToObject(formData: FormData) {
	const obj: any = {};
	for (const [key, value] of formData.entries()) {
		if (value instanceof File) {
			obj[key] = await fileToBase64(value);
		} else {
			obj[key] = value;
		}
	}
	return obj;
}

export async function serializeFormDataToBase64(
	formData: FormData,
): Promise<string> {
	const obj = await formDataToObject(formData);
	const jsonString = JSON.stringify(obj);
	return btoa(encodeURIComponent(jsonString));
}
