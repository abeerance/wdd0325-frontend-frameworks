import { VarietyCard } from "./components/variety-card";

const products = [
	{ id: 1, name: "Wireless Mouse", price: 59.99, badge: "New" },
	{ id: 2, name: "Mechanical Keyboard", price: 149.5 },
	{ id: 3, name: "USB-C Monitor", price: 349, inStock: false },
];

// 1. Write a ProductCardProps interface:
//      name: string, price: number, badge?: string, inStock?: boolean

// 2. Use it on ProductCard, destructuring in the parameter list,
//    and default inStock to true.

// 2.1 if the badge is added as a prop, it should show a badge with the value of the badge
//     can be shown as {badge && <span>...</span>}

// 2.2 inStock can be rendered with the help of a ternary operator. it should either render the price or say the text "Out of stock"
//     {inStock ? (<p>...</p>) : (<p>...</p>)}

function ProductCard() {
	return (
		<div className="rounded-xl border border-slate-200 bg-white p-4">
			<h3 className="font-semibold text-slate-900">Product name</h3>
			{/* Here comes the badge if new */}

			{/* If it is out of stock, show the text "Out of stock", else show the price itself */}
			<p className="mt-1 text-xl font-bold text-slate-800">$0.00</p>
		</div>
	);
}

function App() {
	return (
		<div className="min-h-screen bg-slate-50 p-8">
			<div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
				{/* 3. Pass each product's data to a ProductCard. */}
				{/* {products.map((product) => (<ProductCard key={product.id} ... />))} */}
				<ProductCard />
				<ProductCard />
				<ProductCard />
			</div>
		</div>
	);
}

/*<div>
			<main className="mx-auto max-w-2xl p-8">
				<h1 className="mb-6 font-semibold text-2xl">Seedfellow</h1>
				<VarietyCard />
			</main>
		</div>*/

export default App;
