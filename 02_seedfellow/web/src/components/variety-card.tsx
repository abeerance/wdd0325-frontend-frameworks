import { Text } from "./ui/text";

export function VarietyCard() {
	return (
		<article className="rounded-xl border border-slate-200 p-4">
			<Text variant="title">Berner Rose</Text>
			<Text variant="muted">Solanum lycopersicum</Text>
			<Text className="mt-2">
				A pink beefsteak tomato kept around Bern since the 1950s. Thin skin, so
				it travels badly and tastes like nothing you can buy.
			</Text>
			<Text className="mt-2">Sow in March and April.</Text>
			<Text className="mt-2 font-medium text-sm">4 packets on the shelf</Text>
		</article>
	);
}
