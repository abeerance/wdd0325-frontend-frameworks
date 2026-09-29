import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/cn";

// This is the simplified solution, which is valid but a bit limitiert
// interface TextProps {
// 	children: ReactNode;
// 	variant?: "title" | "body" | "muted";
// 	className?: string; // this is needed if we want to style this component from outside
// }

interface TextProps extends ComponentPropsWithoutRef<"p"> {
	as?: "p" | "span";
	variant?: "title" | "body" | "muted";
}

const VARIANTS = {
	title: "font-medium text-lg",
	body: "text-slate-700",
	muted: "text-slate-500 text-sm italic",
};

// This is the simplified solution, which is valid but a bit limitiert
// export function Text({ children, variant = "body", className }: TextProps) {
// 	return <p className={cn(VARIANTS[variant], className)}>{children}</p>;
// }

export function Text({
	as: Component = "p",
	variant,
	className,
	...rest
}: TextProps) {
	return <Component {...rest} className={cn(VARIANTS[variant], className)} />;
}
