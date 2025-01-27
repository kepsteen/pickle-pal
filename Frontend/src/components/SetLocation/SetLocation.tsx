import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { setLocation } from "../../lib/api";
import { useAuth } from "@clerk/clerk-react";

type SetLocationProps = {
	setPosition: (value: GeolocationPosition | null) => void;
	position: GeolocationPosition | null;
};

export const SetLocation = ({ setPosition, position }: SetLocationProps) => {
	const { getToken } = useAuth();

	const query = useQuery({
		queryKey: ["setLocation"],
		queryFn: async () => {
			const token = await getToken();
			if (!position || !token) return null;
			const data = await setLocation(position, token);
			return data;
		},
	});

	useEffect(() => {
		if (position) {
			const pos = {
				coordinates: [position?.coords.longitude, position?.coords.latitude],
			};
			console.log("pos", pos);
		}
	}, [position, query]);

	function handleGetLocation() {
		navigator.geolocation.getCurrentPosition((pos) => setPosition(pos));
		query.refetch();
	}

	return (
		<>
			<button onClick={handleGetLocation}>Get location</button>
			<p>{JSON.stringify(query.data)}</p>
		</>
	);
};
