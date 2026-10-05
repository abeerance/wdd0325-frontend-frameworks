import { useState, type ReactNode } from "react";

interface PanelProps {
	title: string;
	children: ReactNode;
}

function Panel({ title, children }: PanelProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<section>
			<h3>{title}</h3>
			{isOpen ? (
				<p>{children}</p>
			) : (
				<button type="button" onClick={() => setIsOpen(true)}>
					Show
				</button>
			)}
		</section>
	);
}

export default function App() {
	return (
		<div>
			<Panel title="About">Founded in 2019.</Panel>
			<Panel title="Contact">Open weekdays.</Panel>
		</div>
	);
}
