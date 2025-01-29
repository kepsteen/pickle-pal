// import { setLocation } from "../../lib/api";

import { useState } from "react";

type SetLocationProps = {
	// setPosition: (value: GeolocationPosition | null) => void;
	// position: GeolocationPosition | null;
	setMaxDistance: (value: number) => void;
	maxDistance: number;
};

export const SetLocation = ({
	// setPosition,
	// position,
	maxDistance,
	setMaxDistance,
}: SetLocationProps) => {
	const [sliderValue, setSliderValue] = useState(maxDistance);

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
		</>
	);
};
