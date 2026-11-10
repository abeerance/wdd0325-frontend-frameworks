// src/components/photo-credit.tsx
import type { PhotoCredit as Credit } from "@/lib/types";

interface PhotoCreditProps {
	credit: Credit;
}

// Who took the photograph and under which licence, with a link to where it came from.
// Most of the library's photographs are shared on the condition that this is shown
// wherever they are, and that a changed copy says it was changed.
export function PhotoCredit({ credit }: PhotoCreditProps) {
	return (
		<figcaption className="flex flex-wrap items-center gap-x-1 text-bark text-xs">
			<span>
				{credit.author}, {credit.licence}
				{credit.modified ? ", modified" : ""}.
			</span>
			<a
				href={credit.source_url}
				className="inline-flex min-h-11 items-center rounded-sm font-medium text-moss underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2"
			>
				Original photograph
			</a>
		</figcaption>
	);
}
