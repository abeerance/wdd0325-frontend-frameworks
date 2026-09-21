const varierties = [
	{
		name: "Cuor di Bue",
		latinName: "Solanum lycopersicum",
		description:
			"	The oxheart tomato, pointed at the base and almost hollow inside. It came to the library from a member whose grandmother grew it  Ticino.",
		sowTime: "Sow in March and April.",
		amount: 4,
	},
	{
		name: "Cuor di Bue",
		latinName: "Solanum lycopersicum",
		description:
			"	The oxheart tomato, pointed at the base and almost hollow inside. It came to the library from a member whose grandmother grew it  Ticino.",
		sowTime: "Sow in March and April.",
		amount: 4,
	},
	{
		name: "Cuor di Bue",
		latinName: "Solanum lycopersicum",
		description:
			"	The oxheart tomato, pointed at the base and almost hollow inside. It came to the library from a member whose grandmother grew it  Ticino.",
		sowTime: "Sow in March and April.",
		amount: 4,
	},
	{
		name: "Cuor di Bue",
		latinName: "Solanum lycopersicum",
		description:
			"	The oxheart tomato, pointed at the base and almost hollow inside. It came to the library from a member whose grandmother grew it  Ticino.",
		sowTime: "Sow in March and April.",
		amount: 4,
	},
	{
		name: "Cuor di Bue",
		latinName: "Solanum lycopersicum",
		description:
			"	The oxheart tomato, pointed at the base and almost hollow inside. It came to the library from a member whose grandmother grew it  Ticino.",
		sowTime: "Sow in March and April.",
		amount: 4,
	},
];

function App() {
	return (
		<main>
			<h1>Seedfellow</h1>

			{varierties.map((variety, index) => (
				<article key={index}>
					<h2>{variety.name}</h2>
					<p>
						<em>{variety.latinName}</em>
					</p>
					<p>{variety.description}</p>
					<p>{variety.sowTime}</p>
					<p>{variety.amount} packets on the shelf</p>
				</article>
			))}
		</main>
	);
}

export default App;
