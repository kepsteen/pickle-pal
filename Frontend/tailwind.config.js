import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			minHeight: {
				"main-content": "calc(100vh - 80px)",
			},
			colors: {
				muted: "oklch(70% 0.012 75)",
			},
		},
	},
	daisyui: {
		themes: [
			{
				abyss: {
					"base-100": "oklch(15% 0.08 209)",
					"base-200": "oklch(20% 0.08 209)",
					"base-300": "oklch(10% 0.08 209)",
					"base-content": "oklch(98% 0.016 73.684)",
					primary: "oklch(92% 0.2653 125)",
					"primary-content": "oklch(50% 0.2653 125)",
					secondary: "oklch(83.27% 0.0764 298.3)",
					"secondary-content": "oklch(43.27% 0.0764 298.3)",
					accent: "oklch(43% 0 0)",
					"accent-content": "oklch(98% 0 0)",
					neutral: "oklch(30% 0.08 209)",
					"neutral-content": "oklch(98% 0.016 73.684)",
					info: "oklch(74% 0.16 232.661)",
					"info-content": "oklch(29% 0.066 243.157)",
					success: "oklch(79% 0.209 151.711)",
					"success-content": "oklch(26% 0.065 152.934)",
					warning: "oklch(84.8% 0.1962 84.62)",
					"warning-content": "oklch(44.8% 0.1962 84.62)",
					error: "oklch(65% 0.1985 24.22)",
					"error-content": "oklch(27% 0.1985 24.22)",

					"--rounded-box": "0.5rem", // border radius rounded-box utility class, used in card and other large boxes
					"--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
					"--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
					"--animation-btn": "0.25s", // duration of animation when you click on button
					"--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
					"--btn-focus-scale": "0.95", // scale transform of button when you focus on it
					"--border-btn": "1px", // border width of buttons
					"--tab-border": "1px", // border width of tabs
					"--tab-radius": "0.5rem", // border radius of tabs

					// "radius-selector": "2rem",
					// "radius-field": "0.25rem",
					// "radius-box": "0.5rem",
					// "size-selector": "0.25rem",
					// "size-field": "0.25rem",
					// border: "1px",
				},
			},
		],
	},
	plugins: [daisyui],
};
