import { useState } from "react";

export default function DUPRRangeInput() {
	const [value, setValue] = useState(2.0);
	return (
		<div className="w-full">
			<span className="pl-2 text-primary">{value}</span>
			<input
				type="range"
				min={2}
				max={8}
				step={0.1}
				value={value}
				onChange={(e) =>
					setValue(Number(parseFloat(e.target.value).toFixed(1)))
				}
				className="range range-primary"
			/>
		</div>
	);
}