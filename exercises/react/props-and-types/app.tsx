// Night 4, block 2. The props-and-types exercise, as we solved it in the room.
//
// One component, three different cards. Everything that differs between them
// arrives as a prop, and the interface is the contract that says which props exist
// and which of them may be left out.

const products = [
	{ id: 1, name: "Wireless Mouse", price: 59.99, badge: "New" },
	{ id: 2, name: "Mechanical Keyboard", price: 149.5 },
	{ id: 3, name: "USB-C Monitor", price: 349, inStock: false },
];

// 1. Write a ProductCardProps interface:
//      name: string, price: number, badge?: string, inStock?: boolean
//
// The ? marks a prop the parent may leave out. Inside the component the value is
// then `string | undefined`, which is why the two optional ones need handling
// below rather than being printed straight out.
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
// The props arrive as one object. Pulling the four names out in the parameter list
// is destructuring, from the JavaScript course. `inStock = true` is a default
// parameter: when the parent omits the prop, the component sees true rather than
// undefined. defaultProps does not exist on function components any more.
function ProductCard({ name, price, badge, inStock = true }: ProductCardProps) {
	return (
		<div className="rounded-xl border border-slate-200 bg-white p-4">
			<h3 className="font-semibold text-slate-900">{name}</h3>
			{/* Here comes the badge if new.
			    {badge && <span>} renders the span only when badge holds a value.
			    Careful with numbers on the left of &&: {count && <p>} prints a bare 0
			    when count is 0, because 0 is falsy and React renders it. */}
			{badge && (
				<span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
					{badge}
				</span>
			)}

			{/* If it is out of stock, show the text "Out of stock", else show the price
			    itself. This is one or the other, never both, so it is a ternary and not
			    two && lines. The ternary is the JavaScript one: condition ? a : b. */}
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
				{/* 3. Pass each product's data to a ProductCard.
				    .map turns the array of objects into an array of elements, and React
				    renders an array of elements. key identifies the item so React can
				    match it up again after the list changes; the id is stable, the index
				    is not. Note badge and inStock are simply undefined on the products
				    that lack them, which is exactly what the ? in the interface allows. */}
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
