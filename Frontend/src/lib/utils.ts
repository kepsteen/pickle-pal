import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { RefinementCallback } from "../hooks/useRefinement";
import { SignUpFormData } from "../types/auth";
import { ProfileData } from "../types/user.types";
import { ProfileFilters } from "../components/ProfileFilter/ProfileFilter";

export const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

export function formatCoordinates(position: GeolocationPosition | null) {
	if (position === null) return [];
	return [position.coords.longitude, position.coords.latitude];
}

export function checkEmailToBeUnique(): RefinementCallback<SignUpFormData> {
	return async (data, { signal }) => {
		try {
			const response = await fetch(`/api/users/verify/${data.email}`, {
				signal,
			});

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

/**
 * Filters profiles based on the provided filter criteria
 * @param profiles Array of profiles to filter
 * @param filters Filter criteria
 * @returns Filtered array of profiles
 */
export function filterProfiles(
	profiles: ProfileData[] | undefined,
	filters: ProfileFilters
): ProfileData[] {
	if (!profiles || profiles.length === 0) {
		return [];
	}

	return profiles.filter((profile) => {
		// Filter by DUPR rating
		const duprInRange =
			profile.duprRating >= filters.duprRating.min &&
			profile.duprRating <= filters.duprRating.max;
		if (!duprInRange) return false;

		// Filter by play style if any play style filter is selected
		const anyPlayStyleSelected = Object.values(filters.playStyle).some(
			(value) => value
		);
		if (anyPlayStyleSelected) {
			// Only filter if the profile's play style is not selected
			if (!filters.playStyle[profile.playStyle]) {
				return false;
			}
		}

		// Filter by looking for if any looking for filter is selected
		const anyLookingForSelected = Object.values(filters.lookingFor).some(
			(value) => value
		);
		if (anyLookingForSelected) {
			// Check if any of the profile's lookingFor values match the selected filters
			const hasMatchingLookingFor = profile.lookingFor.some((item) => {
				const key = item.toLowerCase() as keyof typeof filters.lookingFor;
				return filters.lookingFor[key];
			});

			if (!hasMatchingLookingFor) {
				return false;
			}
		}

		// If all filters pass, include the profile
		return true;
	});
}
