// import { setLocation } from "../../lib/api";

import { useState } from "react";
import Button from "../Button/Button";

type SetLocationProps = {
	setPosition: (value: GeolocationPosition | null) => void;
	setMaxDistance: (value: number) => void;
	maxDistance: number;
};

export const SetLocation = ({
	setPosition,
	maxDistance,
	setMaxDistance,
}: SetLocationProps) => {
	const [sliderValue, setSliderValue] = useState(maxDistance);

	const handleLocationUpdate = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			setPosition(position);
		});
	};

	return (
		<>
			<p className="pb-2 text-center text-md text-primary">
				{sliderValue} miles
			</p>
			<input
				onChange={(e) => setSliderValue(Number(e.target.value))}
				onMouseUp={() => setMaxDistance(sliderValue)}
				onTouchEnd={() => setMaxDistance(sliderValue)}
				type="range"
				min={1}
				max="100"
				value={sliderValue} // Use local state for the slider value
				className="w-2/3 mx-auto range range-primary"
			/>
			<Button
				size="sm"
				className="w-48 mx-auto mt-4"
				variant="ghost"
				onClick={handleLocationUpdate}
			>
				Update Location
			</Button>
		</>
	);
};
