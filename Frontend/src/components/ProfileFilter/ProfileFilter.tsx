import { useState } from "react";
import Label from "../Label/Label";
import { Input } from "../Input/Input";

interface ProfileFilterProps {
	onFilterChange: (filters: ProfileFilters) => void;
}

export interface ProfileFilters {
	duprRating: {
		min: number;
		max: number;
	};
	lookingFor: {
		competitive: boolean;
		casual: boolean;
		friends: boolean;
		drilling: boolean;
	};
	playStyle: {
		Dinker: boolean;
		Hybrid: boolean;
		Banger: boolean;
	};
}

export function ProfileFilter({ onFilterChange }: ProfileFilterProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [filters, setFilters] = useState<ProfileFilters>({
		duprRating: { min: 2, max: 8 },
		lookingFor: {
			competitive: false,
			casual: false,
			friends: false,
			drilling: false,
		},
		playStyle: {
			Dinker: false,
			Hybrid: false,
			Banger: false,
		},
	});

	const handleDuprChange = (type: "min" | "max", value: number) => {
		// Ensure value is within valid range (2-8)
		const validValue = Math.min(Math.max(value, 2), 8);

		// Ensure min doesn't exceed max and max doesn't go below min
		let newMin = type === "min" ? validValue : filters.duprRating.min;
		let newMax = type === "max" ? validValue : filters.duprRating.max;

		if (newMin > newMax) {
			if (type === "min") {
				newMin = newMax;
			} else {
				newMax = newMin;
			}
		}

		const newFilters = {
			...filters,
			duprRating: {
				min: newMin,
				max: newMax,
			},
		};
		setFilters(newFilters);
		onFilterChange(newFilters);
	};

	const handleLookingForChange = (
		option: keyof ProfileFilters["lookingFor"]
	) => {
		const newFilters = {
			...filters,
			lookingFor: {
				...filters.lookingFor,
				[option]: !filters.lookingFor[option],
			},
		};
		setFilters(newFilters);
		onFilterChange(newFilters);
	};

	const handlePlayStyleChange = (style: keyof ProfileFilters["playStyle"]) => {
		const newFilters = {
			...filters,
			playStyle: {
				...filters.playStyle,
				[style]: !filters.playStyle[style],
			},
		};
		setFilters(newFilters);
		onFilterChange(newFilters);
	};

	return (
		<div className="w-full max-w-md mx-auto mb-6">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center justify-between w-full px-4 py-2 text-left rounded-lg bg-base-200"
			>
				<span className="font-medium text-primary">Filter Profiles</span>
				<svg
					className={`w-5 h-5 transition-transform text-primary ${
						isOpen ? "rotate-180" : ""
					}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<div className="p-4 mt-2 rounded-lg bg-base-200">
					{/* DUPR Rating Filter */}
					<div className="mb-4">
						<Label className="mb-2 text-base">DUPR Rating</Label>
						<div className="flex items-center gap-4">
							<div className="w-full">
								<Label className="mb-1 text-sm">Min</Label>
								<Input
									name="duprMin"
									type="number"
									min={2}
									max={8}
									step={0.1}
									value={filters.duprRating.min.toString()}
									onChange={(e) =>
										handleDuprChange("min", parseFloat(e.target.value) || 2)
									}
									size="sm"
									variant="primary"
								/>
							</div>
							<div className="w-full">
								<Label className="mb-1 text-sm">Max</Label>
								<Input
									name="duprMax"
									type="number"
									min={2}
									max={8}
									step={0.1}
									value={filters.duprRating.max.toString()}
									onChange={(e) =>
										handleDuprChange("max", parseFloat(e.target.value) || 8)
									}
									size="sm"
									variant="primary"
								/>
							</div>
						</div>
					</div>

					{/* Looking For Filter */}
					<div className="mb-4">
						<Label className="mb-2 text-base">Looking For</Label>
						<div className="grid grid-cols-2 gap-2">
							{(["competitive", "casual", "friends", "drilling"] as const).map(
								(option) => (
									<label
										key={option}
										className="flex items-center gap-2 cursor-pointer"
									>
										<input
											type="checkbox"
											className="checkbox checkbox-primary checkbox-sm"
											checked={filters.lookingFor[option]}
											onChange={() => handleLookingForChange(option)}
										/>
										<span className="capitalize">{option}</span>
									</label>
								)
							)}
						</div>
					</div>

					{/* Play Style Filter */}
					<div>
						<Label className="mb-2 text-base">Play Style</Label>
						<div className="grid grid-cols-3 gap-2">
							{(["Dinker", "Hybrid", "Banger"] as const).map((style) => (
								<label
									key={style}
									className="flex items-center gap-2 cursor-pointer"
								>
									<input
										type="checkbox"
										className="checkbox checkbox-primary checkbox-sm"
										checked={filters.playStyle[style]}
										onChange={() => handlePlayStyleChange(style)}
									/>
									<span>{style}</span>
								</label>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
