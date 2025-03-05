import { forwardRef, useState, useEffect } from "react";

interface DUPRRangeInputProps {
	value?: number;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	name?: string;
}

export const DUPRRangeInput = forwardRef<HTMLInputElement, DUPRRangeInputProps>(
	({ value: externalValue, onChange, ...props }, ref) => {
		const [internalValue, setInternalValue] = useState(externalValue || 2.0);

		// Update internal state when external value changes
		useEffect(() => {
			if (externalValue !== undefined) {
				setInternalValue(externalValue);
			}
		}, [externalValue]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = Number(parseFloat(e.target.value).toFixed(1));
			setInternalValue(newValue);
			if (onChange) {
				onChange(e);
			}
		};

		return (
			<div className="w-full">
				<span className="pl-2 text-primary">{internalValue}</span>
				<input
					{...props}
					type="range"
					ref={ref}
					min={2}
					max={8}
					step={0.1}
					value={internalValue}
					onChange={handleChange}
					className="range range-primary"
				/>
			</div>
		);
	}
);
