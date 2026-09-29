// Night 5, block 2. The event-handler-props exercise, as we solved it in the room.
//
// A child never decides what a click does. The parent passes a function down as a
// prop, and the child only decides when to call it.

const TAGS = ["react", "typescript", "css"];

// 1. Write a ToolbarButtonProps interface above ToolbarButton:
//      label: string
//      onAction: () => void      a function taking no arguments, returning nothing
//    Give the component that interface and pull both values out in the
//    parameter list:
//      function ToolbarButton({ label, onAction }: ToolbarButtonProps)
//    Then put onAction on the button's onClick, and render {label} in place
//    of the fixed word Button below.
interface ToolbarButtonProps {
	label: string;
	onAction: () => void;
}

function ToolbarButton({ label, onAction }: ToolbarButtonProps) {
	return (
		<button
			type="button" // this one is important, if this is not added, this will falback to a form submit button
			className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
			// By name, no arrow: onAction takes no arguments, so handing it the
			// click event directly costs nothing.
			onClick={onAction}
		>
			{label}
		</button>
	);
}

// 2. Write a TagListProps interface above TagList:
//      tags: string[]
//      onSelect: (tag: string) => void    receives the clicked tag
//    Signature:
//      function TagList({ tags, onSelect }: TagListProps)
//    Replace the single fixed <li> with tags.map, one <li> per tag, each <li>
//    carrying a key. Each button needs its own arrow function so it can call
//    onSelect with its own tag.
interface TagListProps {
	tags: string[];
	onSelect: (tag: string) => void;
}

function TagList({ tags, onSelect }: TagListProps) {
	return (
		<ul className="flex gap-2">
			{tags.map((tag) => (
				<li key={tag}>
					<button
						type="button"
						// An arrow here, because onSelect needs this button's tag. Each
						// arrow remembers the tag of the iteration that made it.
						onClick={() => onSelect(tag)}
						className="rounded bg-slate-200 px-2 py-1 text-xs"
					>
						{tag}
					</button>
				</li>
			))}
		</ul>
	);
}

export default function App() {
	// 3. Write both handlers here, inside App and above the return:
	//      function handleAction(): void
	//      function handleSelect(tag: string): void
	//    Use window.alert inside each one so the result is visible in the
	//    preview, and put the tag in the message of the second so you can tell
	//    which button sent it.
	function handleAction(): void {
		window.alert("Toolbar action");
	}

	function handleSelect(tag: string): void {
		window.alert("You picked " + tag);
	}

	return (
		<div className="min-h-screen bg-slate-50 p-8">
			<div className="mx-auto max-w-md space-y-6 rounded-xl border border-slate-200 bg-white p-6">
				<div className="flex gap-2">
					{/* 4. Pass a label and onAction to each of the two buttons, for
               example label="Save" onAction={handleAction}. Pass the handler
               by name: onAction={handleAction()} calls it during render and
               hands the button whatever it returned. */}
					<ToolbarButton label="Save" onAction={handleAction} />
					<ToolbarButton label="Print" onAction={handleAction} />
				</div>

				{/* 5. Pass tags and onSelect to TagList. tags is the array declared
             at the top of this file, so it goes in braces rather than
             quotes, and onSelect gets handleSelect by name. */}
				<TagList tags={TAGS} onSelect={handleSelect} />
			</div>
		</div>
	);
}
