import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/cn";

// This is the simplified solution, which is valid but a bit limitiert
// interface TextProps {
// 	children: ReactNode;
// 	variant?: "title" | "body" | "muted";
// 	className?: string; // this is needed if we want to style this component from outside
// }

// The full version. Extending ComponentPropsWithoutRef<"p"> gives Text every prop a
// <p> accepts (children, className, id, onClick, aria-*), so it needs no list of
// its own beyond the two it adds.
interface TextProps extends ComponentPropsWithoutRef<"p"> {
	// Which element to render. A <p> cannot sit inside another <p>, so inline text
	// needs a span.
	as?: "p" | "span";
	variant?: "title" | "body" | "muted";
}

// One class string per variant, looked up by name below. Adding a variant means one
// line here and one in the union above.
const VARIANTS = {
	title: "font-medium text-lg",
	body: "text-slate-700",
	muted: "text-slate-500 text-sm italic",
};

// This is the simplified solution, which is valid but a bit limitiert
// export function Text({ children, variant = "body", className }: TextProps) {
// 	return <p className={cn(VARIANTS[variant], className)}>{children}</p>;
// }

// `as: Component` renames the prop while destructuring. The capital matters: JSX
// treats <Component /> as a variable and <component /> as an HTML tag.
// ...rest collects every other prop and spreads it onto the element. className
// comes after the spread so cn can merge it with the variant instead of being
// overwritten by it.
export function Text({
	as: Component = "p",
	variant = "body",
	className,
	...rest
}: TextProps) {
	return <Component {...rest} className={cn(VARIANTS[variant], className)} />;
}
