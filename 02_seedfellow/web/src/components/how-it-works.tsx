import { Text } from "./ui/text";

interface Step {
	id: string;
	title: string;
	text: string;
}

// The sequence matters: members borrow, grow, then return seed, so use an <ol>.
// Number badges follow the array order to stay in sync when steps change.
const STEPS: Step[] = [
	{
		id: "borrow",
		title: "Borrow a packet",
		text: "Pick a variety from the shelf below and borrow a packet of its seed.",
	},
	{
		id: "grow",
		title: "Grow it",
		text: "Sow it in the months on its card, in a garden bed or a pot on the balcony.",
	},
	{
		id: "return",
		title: "Bring seed back",
		text: "Save seed from your best plants and bring some back at the end of the season.",
	},
];

export function HowItWorks() {
	return (
		<section className="flex flex-col gap-5">
			<h2 className="font-semibold text-2xl text-ink">How it works</h2>
			<ol className="grid gap-6 border-line border-y py-6 sm:grid-cols-3 sm:gap-8">
				{STEPS.map((step, index) => (
					<li key={step.id} className="flex gap-4 sm:flex-col sm:gap-3">
						<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-moss font-semibold text-card">
							{index + 1}
						</span>
						<div className="flex flex-col gap-1">
							<h3 className="font-semibold text-ink text-lg">{step.title}</h3>
							<Text className="text-bark">{step.text}</Text>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
