import { HowItWorks } from "./how-it-works";
import { Text } from "./ui/text";

export function Hero() {
	return (
		<div className="flex flex-col gap-12">
			<header className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
				<div className="flex flex-col gap-4">
					<Text className="font-medium text-moss text-sm uppercase tracking-widest">
						A neighbourhood seed library
					</Text>
					<h1 className="font-semibold text-4xl text-ink leading-tight sm:text-5xl">
						Old seed stays alive when people grow it
					</h1>
					<Text className="max-w-prose text-bark text-lg">
						Borrow a packet of a heritage variety, grow it through the season,
						and bring back some of the seed it sets, so the next member can grow
						it too.
					</Text>
				</div>

				{/* Placeholder art until the library has photographs. The slot keeps its shape
				    either way, so the page will not move when a photo replaces it.
				    Hidden from screen readers because the adjacent text carries the message. */}
				<div
					aria-hidden="true"
					className="relative aspect-video overflow-hidden rounded-3xl bg-linear-to-br from-sun/40 via-dew to-leaf/40 lg:aspect-4/3"
				>
					{/* Bottom alignment keeps the soil and stems visible when the wider mobile
					    slot crops the illustration. Inline SVG lets it share the Tailwind palette. */}
					<svg
						viewBox="0 0 400 300"
						preserveAspectRatio="xMidYMax slice"
						className="absolute inset-0 size-full"
						fill="none"
					>
						<title>Placeholder SVG</title>
						<circle cx="336" cy="116" r="30" className="fill-sun" />
						<path
							d="M0 240C90 224 170 228 240 234C300 239 350 234 400 226V300H0Z"
							className="fill-bark/20"
						/>
						<g
							className="stroke-moss"
							strokeWidth="5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M180 238V216" />
							<path
								d="M180 222c0-8 6-12 14-12 0 8-6 12-14 12Z"
								className="fill-leaf"
							/>
							<path d="M236 238V186" />
							<path
								d="M236 204c0-14 10-22 24-22 0 14-10 22-24 22Z"
								className="fill-leaf"
							/>
							<path
								d="M236 216c0-12-9-18-20-18 0 12 9 18 20 18Z"
								className="fill-leaf"
							/>
							<path d="M300 236V150" />
							<path
								d="M300 172c0-16 12-25 27-25 0 16-12 25-27 25Z"
								className="fill-leaf"
							/>
							<path
								d="M300 192c0-14-11-22-24-22 0 14 11 22 24 22Z"
								className="fill-leaf"
							/>
							<circle cx="300" cy="140" r="9" className="fill-sun" />
						</g>
						<g transform="rotate(-8 100 190)">
							<rect
								x="60"
								y="128"
								width="88"
								height="114"
								rx="10"
								className="fill-card stroke-line"
								strokeWidth="3"
							/>
							<path d="M60 158H148" className="stroke-line" strokeWidth="3" />
							<path
								d="M104 226v-32"
								className="stroke-moss"
								strokeWidth="4"
								strokeLinecap="round"
							/>
							<path
								d="M104 202c0-10 7-16 17-16 0 10-7 16-17 16Z"
								className="fill-leaf stroke-moss"
								strokeWidth="3"
							/>
							<path
								d="M76 143h38"
								className="stroke-bark/50"
								strokeWidth="4"
								strokeLinecap="round"
							/>
						</g>
					</svg>
				</div>
			</header>
			<HowItWorks />
		</div>
	);
}
