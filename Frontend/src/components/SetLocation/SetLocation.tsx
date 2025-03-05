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
		<div className="flex flex-col items-center w-full gap-2 sm:flex-row">
			<div className="flex items-center flex-1 gap-2">
				<input
					onChange={(e) => setSliderValue(Number(e.target.value))}
					onMouseUp={() => setMaxDistance(sliderValue)}
					onTouchEnd={() => setMaxDistance(sliderValue)}
					type="range"
					min={1}
					max="100"
					value={sliderValue}
					className="flex-1 range range-primary"
				/>
				<span className="text-xl font-semibold text-primary whitespace-nowrap">
					{sliderValue} miles
				</span>
			</div>
			<Button
				size="sm"
				variant="neutral"
				onClick={handleLocationUpdate}
				className="whitespace-nowrap"
			>
				Update Location
			</Button>
		</div>
	);
};
