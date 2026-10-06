// The frame every panel sits in: one place for the border, the corners and the
// padding. Components in ui/ know nothing about seed, so this one is named after how
// it looks. Components about varieties are named after what they are for.
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/cn";

// Everything a <div> accepts (children, className, id, ...), plus `as`, which picks
// the element: "article" for a card that stands on its own, "div" for the rest.
interface CardProps extends ComponentPropsWithoutRef<"div"> {
	as?: "div" | "article";
}

// `as` is renamed to Component because JSX reads a lower-case tag as an HTML
// element: <as> would not compile. A capital letter makes JSX read it as a variable.
// className is taken out so it can be merged; everything else, children included,
// stays in rest and is spread onto the element.
export function Card({ as: Component = "div", className, ...rest }: CardProps) {
	return (
		<Component
			{...rest}
			// cn merges the frame with the caller's classes; on a clash, the caller wins.
			className={cn("rounded-xl border border-slate-200 p-4", className)}
		/>
	);
}
