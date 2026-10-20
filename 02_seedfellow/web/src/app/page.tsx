import { Catalogue } from "@/components/catalogue";
import { Hero } from "@/components/hero";

export default function Home() {
	return (
		<main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:py-14">
			<Hero />
			<Catalogue />
		</main>
	);
}
