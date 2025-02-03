import PalCardCondensed from "../../components/PalCardCondensed/PalCardCondensed";

const pals = [
	{
		palId: "1",
		name: "Ben Johns",
		imageUrl:
			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
	},
	{
		palId: "2",
		name: "John Doe",
		imageUrl:
			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
	},
	{
		palId: "3",
		name: "Anna Smith",
		imageUrl:
			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
	},
	{
		palId: "4",
		name: "Riley Johnson",
		imageUrl:
			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
	},
	{
		palId: "5",
		name: "Sam Wilson",
		imageUrl:
			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
	},
	{
		palId: "6",
		name: "Taylor Swift",
		imageUrl:
			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
	},
	{
		palId: "7",
		name: "Chris Evans",
		imageUrl:
			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
	},
	{
		palId: "8",
		name: "Emma Watson",
		imageUrl:
			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
	},
	{
		palId: "9",
		name: "Michael Jordan",
		imageUrl:
			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
	},
	{
		palId: "10",
		name: "Sarah Parker",
		imageUrl:
			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
	},
	{
		palId: "11",
		name: "David Miller",
		imageUrl:
			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
	},
	{
		palId: "12",
		name: "Jessica Alba",
		imageUrl:
			"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
	},
];

const query = useQuery({
	queryKey: ["pals"],
	queryFn: () => {
		return pals;
	},
});

export default function PalsPage() {
	return (
		<div className="flex flex-col justify-start overflow-scroll max-h-main-content">
			<h1 className="mb-4 text-4xl font-semibold text-base-content">Pals</h1>
			<section className="overflow-scroll">
				<ul className="flex flex-col gap-4">
					{pals.map((pal) => (
						<li key={pal.palId}>
							<PalCardCondensed
								palId={pal.palId}
								name={pal.name}
								imageUrl={pal.imageUrl}
							/>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}
