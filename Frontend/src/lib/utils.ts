import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { RefinementCallback } from "../hooks/useRefinement";
import { SignUpFormData } from "../types/auth";

export const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

export function checkEmailToBeUnique(): RefinementCallback<SignUpFormData> {
	return async (data, { signal }) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BASE_URL}/api/users/${data.email}`,
				{ signal }
			);

			if (!response.ok) throw new Error("Error verifying email");
			const { uniqueEmail } = await response.json();
			return uniqueEmail;
		} catch (error) {
			if ((error as Error).name === "AbortError") {
				return false;
			}
			throw error;
		}
	};
}
