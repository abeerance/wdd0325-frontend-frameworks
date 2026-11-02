import { Text } from "@/components/ui/text";

export default function AboutPage() {
	return (
		<div className="flex flex-col gap-8">
			<header className="flex flex-col gap-2">
				<p className="font-medium text-moss text-sm uppercase tracking-widest">
					Four steps
				</p>
				<h1 className="font-semibold text-4xl text-ink sm:text-5xl">
					How the library works
				</h1>
			</header>

			<div className="flex max-w-prose flex-col gap-4">
				<Text>
					Borrow a packet. Pick a variety from the catalogue and take one packet
					of its seed home.
				</Text>
				<Text>
					Grow it. Sow it when the card says, in a pot or in the ground, and let
					a few plants go all the way to seed.
				</Text>
				<Text>
					Bring seed back at the end of the season. A librarian puts it on the
					shelf for the next member, which is how a variety stays alive.
				</Text>
				<Text>
					Write a harvest note. Say what you sowed, what came up and what you
					would do differently, so the next grower starts from what you learned.
				</Text>
			</div>
		</div>
	);
}
