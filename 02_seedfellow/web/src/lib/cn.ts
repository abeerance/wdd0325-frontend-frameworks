// One helper, used by every component that takes a className.
//
// The problem it solves: gluing two class strings together leaves both classes in
// the markup. Pass p-8 to a component whose own class is p-4 and the element
// carries p-4 p-8, with the winner decided by the order Tailwind generated them in
// rather than by the order you wrote them.
//
// clsx joins the pieces and drops anything falsy, so a conditional class is an
// expression: cn("p-4", isOpen && "border"). tailwind-merge knows p-4 and p-8 are
// the same kind of utility and keeps the last one.
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ...classes collects every argument into one array, so cn takes as many pieces as
// the caller has.
export function cn(...classes: ClassValue[]) {
	return twMerge(clsx(classes));
}
