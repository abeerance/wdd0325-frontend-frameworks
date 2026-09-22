const products = [
	{ id: 1, name: "Wireless Mouse", price: 59.99, badge: "New" },
	{ id: 2, name: "Mechanical Keyboard", price: 149.5 },
	{ id: 3, name: "USB-C Monitor", price: 349, inStock: false },
];

// 1. Write a ProductCardProps interface:
//      name: string, price: number, badge?: string, inStock?: boolean
interface ProductCardProps {
	name: string;
	price: number;
	badge?: string;
	inStock?: boolean;
}

// 2.1 if the badge is added as a prop, it should show a badge with the value of the badge
//     can be shown as {badge && <span>...</span>}

// 2.2 inStock can be rendered with the help of a ternary operator. it should either render the price or say the text "Out of stock"
//     {inStock ? (<p>...</p>) : (<p>...</p>)}

// 2. Use it on ProductCard, destructuring in the parameter list,
//    and default inStock to true.
function ProductCard({ name, price, badge, inStock = true }: ProductCardProps) {
	return (
		<div className="rounded-xl border border-slate-200 bg-white p-4">
			<h3 className="font-semibold text-slate-900">{name}</h3>
			{/* Here comes the badge if new */}
			{badge && (
				<span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
					{badge}
				</span>
			)}

			{/* If it is out of stock, show the text "Out of stock", else show the price itself */}
			{inStock ? (
				<p className="mt-1 text-xl font-bold text-slate-800">${price}</p>
			) : (
				<p className="mt-1 text-sm font-medium text-red-600">Out of stock</p>
			)}
		</div>
	);
}

function App() {
	return (
		<div className="min-h-screen bg-slate-50 p-8">
			<div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
				{/* 3. Pass each product's data to a ProductCard. */}
				{/* {products.map((product) => (<ProductCard key={product.id} ... />))} */}
				{products.map((product) => (
					<ProductCard
						key={product.id}
						name={product.name}
						price={product.price}
						badge={product.badge}
						inStock={product.inStock}
					/>
				))}
			</div>
		</div>
	);
}

export default App;
