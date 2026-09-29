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
			{orders.length > 0 && (
				<p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
					{orders.length} orders
				</p>
			)}

			<ul className="space-y-2">
				{orders.map((order) => {
					return (
						<li
							key={order.id}
							className="rounded-lg border border-slate-200 bg-white p-3"
						>
							<div className="flex items-center justify-between">
								<span className="font-medium text-slate-900">{order.item}</span>
								<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
									{order.shipped ? "Shipped" : "Packing"}
								</span>
							</div>
							<p className="mt-1 text-sm text-slate-500">
								{order.quantity} ordered
							</p>
							{order.giftNote !== "" && (
								<p className="mt-1 text-xs italic text-amber-700">
									{order.giftNote}
								</p>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
