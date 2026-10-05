// 1. Add the import for useState above this line. It is a named import, so the
//    name goes in braces, the same way every example in this lesson imports it.

import { useState } from "react";

const CAPACITY = 10;

function TicketCounter() {
	// 1. Declare the state variable and its setter here, starting at 0. useState(0)
	//    hands back a pair, so destructure the pair on one line:
	//      const [value, setValue] = useState(0)
	//    Name it for what it holds, so the count is sold and the setter is setSold.
	//    The call goes at the top level of the component, never inside a handler,
	//    an if or a loop.
	const [sold, setSold] = useState(0);

	// 6. Calculate how many tickets are left from CAPACITY and the sold count. One
	//    line of arithmetic replaces the CAPACITY on the right below.
	//    No second state variable: a value you can work out from state is not state,
	//    and a stored copy goes stale the moment the count changes. soldOut on the
	//    next line already reads remaining, so both sell buttons switch off for free.
	const remaining = CAPACITY - sold;
	const soldOut = remaining === 0;

	// STEP 3: handle sell ticket function
	function handleSellOne() {
		setSold((current) => current + 1);
	}

	// STEP 4: handle sell 3 ticket function
	function handleSellThree() {
		setSold((current) => Math.min(current + 1, CAPACITY));
		setSold((current) => Math.min(current + 1, CAPACITY));
		setSold((current) => Math.min(current + 1, CAPACITY));
	}

	// STEP 5: reset ticket sell function
	function handleReset() {
		setSold(0);
	}

	return (
		<div className="mx-auto flex max-w-xs flex-col items-center gap-6 py-12">
			<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
				Tickets sold
			</p>

			<div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-indigo-600">
				{/* 2. Show the sold count here instead of the dash. A value goes into JSX
              inside curly braces, so replace the dash character itself and leave
              the span and its classes alone. */}
				<span className="text-4xl font-bold text-white">{sold}</span>
			</div>

			<p className="text-sm text-slate-600">{remaining} seats left</p>

			<div className="flex gap-3">
				{/* 3. Sell one: add an onClick to this button that puts the count up by
              one. onClick takes the function itself, so onClick={handleSell}
              runs it on click and onClick={handleSell()} runs it during the
              render and breaks. Leave the disabled attribute as it is. */}
				<button
					type="button"
					onClick={handleSellOne}
					disabled={soldOut}
					className="h-10 rounded-lg bg-slate-100 px-4 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-40"
				>
					Sell one
				</button>
				{/* 4. Sell three: one click, three separate setter calls, no arithmetic
              on 3. Three calls that pass a value land on one, because all three
              read the same sold from this render. Pass an updater function to
              each of them instead: the setter also accepts a function, React
              calls it with the value it has so far, and what you return becomes
              the next value. Three of those queue up and run in order. */}
				<button
					type="button"
					onClick={handleSellThree}
					disabled={soldOut}
					className="h-10 rounded-lg bg-slate-100 px-4 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-40"
				>
					Sell three
				</button>
				{/* 5. Reset: put the count straight back to 0. This one passes a plain
              value, not an updater, because the new count does not depend on
              the old one. This button has no disabled attribute on purpose. */}
				<button
					type="button"
					onClick={handleReset}
					className="h-10 rounded-lg bg-slate-100 px-4 text-sm font-medium text-slate-700 hover:bg-slate-200"
				>
					Reset
				</button>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<div className="min-h-screen bg-white">
			<TicketCounter />
		</div>
	);
}
