import Link from "next/link";

// A layout wraps every page below /varieties. It stays mounted while the visitor moves from one
// variety to the next, so the Back link is written once here, not in every page.
// LayoutProps<"/varieties"> types `children` the way the root layout does.
export default function VarietiesLayout({
  children,
}: LayoutProps<"/varieties">) {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center self-start rounded-full font-medium text-moss text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2"
      >
        Back to the catalogue
      </Link>
      {children}
    </div>
  );
}
