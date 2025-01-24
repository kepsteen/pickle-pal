import { useEffect, useState } from "react";

export const SetLocation = () => {
	const [position, setPosition] = useState<GeolocationPosition | null>(null);

	useEffect(() => {
		if (position) {
			const pos = {
				coordinates: [position?.coords.longitude, position?.coords.latitude],
			};
			console.log("pos", pos);
		}
	}, [position]);

	function handleGetLocation() {
		navigator.geolocation.getCurrentPosition((pos) => setPosition(pos));
	}
	return <button onClick={handleGetLocation}>Get location</button>;
};
