// Night 3, block 2. The jsx-syntax exercise, as we solved it in the room.
//
// The five tasks are still marked where they were. What follows each one is the
// answer we typed together, so this file reads as both the task and the result.
//
// `Fragment` is imported because task 4 needs it. `ReactNode` is the type a
// component returns; from night 4 on we stop writing it, because every component
// returns one and the compiler already knows.
import { Fragment, type ReactNode } from "react";

// A plain object. Nothing about it is React: it is the data the markup reads.
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
	//
	// The constant lives above the return, because a const is a statement and JSX
	// only takes expressions. The backticks are a template literal from JavaScript:
	// everything inside ${} is evaluated and dropped into the string.
	const summary = `${user.visits} visits since ${user.joined}`;

	return (
		<Fragment>
			{/* Task 4. The footer paragraph at the bottom sits outside the card, so
			    the card and the footer are two elements side by side. A return has to
			    give back one value, and a fragment is the wrapper that adds no element
			    to the page. <> </> is the short way to write the same thing. */}
			<div className="mx-auto my-10 max-w-sm rounded-xl border border-slate-200 bg-white p-6">
				{/* Task 1. Show the name from the object above, instead of NAME.
				    The braces are the door out of JSX and back into JavaScript. Without
				    them, {user.name} would be printed as those literal characters. */}
				<h1 className="text-xl font-semibold text-slate-900">
					Hello, {user.name}
				</h1>

				{/* Task 2. Same for the city. */}
				<p className="text-sm text-slate-500">Lives in {user.city}</p>

				{/* Task 3. Give this paragraph an inline style object setting
               color to "#b45309". Remember it needs two sets of braces.
               The outer pair drops into JavaScript, the inner pair is the object
               itself. Property names are camelCase here: backgroundColor, not
               background-color, because this is JavaScript and not CSS. */}
				<p className="mt-4 text-sm font-medium" style={{ color: "#b45309" }}>
					Low stock in your area
				</p>

				{/* Task 5. Show the summary constant here, instead of SUMMARY.
				    A constant holding a string is shown exactly like a field of an
				    object: one pair of braces around the name. */}
				<p className="mt-1 text-xs text-slate-400">{summary}</p>
			</div>
			<p className="mx-auto my-3 max-w-sm text-center text-xs text-slate-400">
				Task 4. Uncomment this footer once the fragment is in place.
			</p>
		</Fragment>
	);
}

