const tags = ["react", "typescript", "css"];

// 1. Write a ToolbarButtonProps interface above ToolbarButton:
//      label: string
//      onAction: () => void      a function taking no arguments, returning nothing
//    Give the component that interface and pull both values out in the
//    parameter list:
//      function ToolbarButton({ label, onAction }: ToolbarButtonProps)
//    Then put onAction on the button's onClick, and render {label} in place
//    of the fixed word Button below.

function ToolbarButton() {
	return (
		<button
			type="button"
			className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
		>
			Button
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

function TagList() {
	return (
		<ul className="flex gap-2">
			<li>
				<button
					type="button"
					className="rounded bg-slate-200 px-2 py-1 text-xs"
				>
					tag
				</button>
			</li>
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

	return (
		<div className="min-h-screen bg-slate-50 p-8">
			<div className="mx-auto max-w-md space-y-6 rounded-xl border border-slate-200 bg-white p-6">
				<div className="flex gap-2">
					{/* 4. Pass a label and onAction to each of the two buttons, for
               example label="Save" onAction={handleAction}. Pass the handler
               by name: onAction={handleAction()} calls it during render and
               hands the button whatever it returned. */}
					<ToolbarButton />
					<ToolbarButton />
				</div>

				{/* 5. Pass tags and onSelect to TagList. tags is the array declared
             at the top of this file, so it goes in braces rather than
             quotes, and onSelect gets handleSelect by name. */}
				<TagList />
			</div>
		</div>
	);
}
