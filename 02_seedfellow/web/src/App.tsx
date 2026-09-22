// The page. From night 4 it holds no markup of its own beyond the heading: the
// card lives in its own file and is used here as a tag.
//
// A named import, so the braces are required. VarietyCard is exported by name from
// that file; App is the one default export in the project, because main.tsx imports
// it that way.
import { VarietyCard } from "./components/variety-card";

// No return type. Every component returns a ReactNode, so writing it says nothing
// the compiler does not already know.
function App() {
	return (
		<div>
			<main className="mx-auto max-w-2xl p-8">
				<h1 className="mb-6 font-semibold text-2xl">Seedfellow</h1>
				<VarietyCard />
			</main>
		</div>
	);
}

export default App;
