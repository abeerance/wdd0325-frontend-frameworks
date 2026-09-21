import { Fragment, type ReactNode } from "react";

const user = {
	name: "Maria Garcia",
	city: "Porto",
	visits: 7,
	joined: "2024-03-11",
};

export default function App(): ReactNode {
	// Task 5. Declare a constant named summary here, holding the string
	//         `${user.visits} visits since ${user.joined}`, and show it
	//         in the paragraph marked below.
	const summary = `${user.visits} visits since ${user.joined}`;

	return (
		<Fragment>
			{/*// Task 4. The footer paragraph at the bottom is outside the card, so //
			the card and the footer are two elements side by side. // Wrap both in a
			fragment so this return gives back one value.*/}
			<div className="mx-auto my-10 max-w-sm rounded-xl border border-slate-200 bg-white p-6">
				{/* Task 1. Show the name from the object above, instead of NAME. */}
				<h1 className="text-xl font-semibold text-slate-900">
					Hello, {user.name}
				</h1>

				{/* Task 2. Same for the city. */}
				<p className="text-sm text-slate-500">Lives in {user.city}</p>

				{/* Task 3. Give this paragraph an inline style object setting
               color to "#b45309". Remember it needs two sets of braces. */}
				<p className="mt-4 text-sm font-medium" style={{ color: "#b45309" }}>
					Low stock in your area
				</p>

				{/* Task 5. Show the summary constant here, instead of SUMMARY. */}
				<p className="mt-1 text-xs text-slate-400">{summary}</p>
			</div>
			<p className="mx-auto my-3 max-w-sm text-center text-xs text-slate-400">
				Task 4. Uncomment this footer once the fragment is in place.
			</p>
		</Fragment>
	);
}
