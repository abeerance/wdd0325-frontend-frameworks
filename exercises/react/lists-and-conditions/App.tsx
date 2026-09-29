interface Order {
	id: string;
	item: string;
	quantity: number;
	shipped: boolean;
	giftNote: string;
}

const orders: Order[] = [
	{
		id: "A-1041",
		item: "Standing desk",
		quantity: 1,
		shipped: true,
		giftNote: "",
	},
	{
		id: "A-1042",
		item: "Fountain pen",
		quantity: 3,
		shipped: false,
		giftNote: "Happy birthday, Tom",
	},
	{ id: "A-1043", item: "Desk lamp", quantity: 2, shipped: true, giftNote: "" },
	{
		id: "A-1044",
		item: "Notebook",
		quantity: 12,
		shipped: false,
		giftNote: "",
	},
];

export default function App() {
	return (
		<div className="mx-auto my-10 max-w-lg">
			<h1 className="mb-4 text-xl font-semibold text-slate-900">Orders</h1>

			{/* Task 5. Show this heading only while there are orders to list.
                Use a comparison, not the length on its own.
                Wrap the whole <p> below in braces with a guard in front
                of it, so the shape is {SOMETHING > 0 && ( ... )} with
                the paragraph between the parentheses. The braces
                already inside the paragraph stay where they are.
                Trap: orders.length on its own is 0 when the array is
                empty, 0 is falsy, and React prints that 0 on the page.
                Compare it with > 0 so the guard produces false. */}
			<p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
				{orders.length} orders
			</p>

			<ul className="space-y-2">
				{/* Task 1. Replace this single hard-coded row with a map over orders.
                  The call goes in braces and returns the <li> from its
                  arrow function, so the shape around the whole row is
                  {orders.map((order) => ( ... ))}. Inside it, every
                  placeholder reads off the one order the callback was
                  handed: ITEM becomes {order.item} and QUANTITY becomes
                  {order.quantity}, with the word "ordered" left as text.
                  Trap: parentheses after the arrow, not braces. Braces
                  open a function body, and a body with no return gives
                  back undefined, so the list comes out empty.

                  Task 2. Give each row a key taken from the order id.
                          It is an attribute, key={order.id}, and it goes
                          on the <li>, because the <li> elements are the
                          siblings React has to tell apart. Putting it on
                          the <div> inside leaves the warning in place.

                  Task 3. Show the shipped state with a ternary: "Shipped"
                          when shipped is true, "Packing" when it is false.
                          It replaces the word STATUS inside the pill, and
                          the pill keeps its classes either way. Something
                          appears in both cases, which is why this is a
                          ternary and not an &&.

                  Task 4. Show the gift note paragraph only for orders that
                          have one. An empty string is falsy, so compare
                          against "" instead of relying on truthiness.
                          Guard the whole <p> the way Task 5 guards its
                          own, and put {order.giftNote} inside it in place
                          of GIFT NOTE.
                          Trap: the truthy version happens to look right
                          here, because React shows an empty string as
                          nothing. The same habit over a number prints a
                          bare 0, so write the comparison out. */}
				<li className="rounded-lg border border-slate-200 bg-white p-3">
					<div className="flex items-center justify-between">
						<span className="font-medium text-slate-900">ITEM</span>
						<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
							STATUS
						</span>
					</div>
					<p className="mt-1 text-sm text-slate-500">QUANTITY ordered</p>
					<p className="mt-1 text-xs italic text-amber-700">GIFT NOTE</p>
				</li>
			</ul>
		</div>
	);
}
