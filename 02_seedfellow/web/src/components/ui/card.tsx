import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/cn";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
	as?: "div" | "article";
}

export function Card({ as: Component = "div", className, ...rest }: CardProps) {
	return (
		<Component
			{...rest}
			className={cn("rounded-xl border border-slate-200 p-4", className)}
		/>
	);
}
