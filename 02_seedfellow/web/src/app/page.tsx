import { Catalogue } from "@/components/catalogue";

export default function Home() {
	return (
		<div>
			<main className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
				<h1 className="font-semibold text-2xl">Seedfellow</h1>
				<p className="max-w-prose text-bark leading-relaxed">
					Heritage seed, kept alive by lending it out. Borrow a packet, grow it,
					bring some back.
				</p>
				<Catalogue />
			</main>
		</div>
	);
}
