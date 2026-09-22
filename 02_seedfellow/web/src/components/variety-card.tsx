// Night 4. The card, moved out of App.tsx into a file of its own.
//
// File name kebab-case, component name PascalCase, exported by name. The capital is
// what makes <VarietyCard /> a component in the JSX; the kebab-case file name is
// what keeps the build working on a case-sensitive filesystem.
//
// Everything on the card is still typed in by hand. Night 5 turns it into props.
//
// cn is imported ready for the Text component sketched at the bottom of this file.
import { cn } from "../lib/cn";

export function VarietyCard() {
	return (
		<article className="rounded-xl border border-slate-200 p-4">
			<h2 className="font-medium text-lg">Berner Rose</h2>
			<p className="text-slate-500 text-sm italic">Solanum lycopersicum</p>
			<p className="mt-2 text-slate-700">
				A pink beefsteak tomato kept around Bern since the 1950s. Thin skin, so
				it travels badly and tastes like nothing you can buy.
			</p>
			<p className="mt-2 text-slate-700">Sow in March and April.</p>
			<p className="mt-2 font-medium text-sm">4 packets on the shelf</p>
		</article>
	);
}

// Block 3, the task we started: pull the repeated typography out of the card into a
// reusable Text component, so the classes live in one place.
//
// The shape to finish:
//   - VARIANTS maps a variant name to its classes.
//   - Text takes children (type ReactNode, imported with `import type`), an optional
//     variant, and an optional className.
//   - cn puts the variant's classes first and the caller's second, so the caller can
//     override. tailwind-merge drops the loser when two classes fight over the same
//     property.
//
// Text renders a <p>. Not a <div>, and not the heading: an <h2> is the structure of
// the document, and a screen reader builds its outline from the heading levels.

// const VARIANTS = {
// 	title: "...",
// 	body: "...",
// 	muted: "...",
// };

// export function Text() {
// 	return <p className={cn(VARIANTS[variant], className)}>...</p>;
// }
