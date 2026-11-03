import { Text } from "./ui/text";

interface Opening {
	id: string;
	day: string;
	hours: string;
}

// When the library's door is open. Day and hours are a name and its value, which is
// what a <dl> is for. Each pair sits in its own <div>, which HTML allows inside a <dl>,
// so a pair can be laid out as one row.
const OPENINGS: Opening[] = [
	{ id: "wednesday", day: "Wednesday", hours: "17:30 to 19:30" },
	{ id: "saturday", day: "Saturday", hours: "10:00 to 13:00" },
];

export function OpeningHours() {
	return (
		<>
			<dl className="flex max-w-64 flex-col gap-2">
				{OPENINGS.map((opening) => (
					<div key={opening.id} className="flex justify-between gap-6">
						<dt className="text-ink">{opening.day}</dt>
						<dd className="text-bark tabular-nums">{opening.hours}</dd>
					</div>
				))}
			</dl>
			<Text variant="muted">Closed on public holidays.</Text>
		</>
	);
}
