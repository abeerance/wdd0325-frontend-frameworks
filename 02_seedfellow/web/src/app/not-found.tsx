import Link from "next/link";
import { Text } from "@/components/ui/text";

// Shown when no route matches the address, and when a page calls notFound(). It renders inside the
// root layout, so the header and footer stay. A missing page still offers a way back, not a dead end.
export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="font-semibold text-4xl text-ink sm:text-5xl">
        Page not found
      </h1>
      <Text>There is nothing at this address.</Text>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-full bg-moss px-5 font-medium text-card text-sm transition-colors hover:bg-moss-deep focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2"
      >
        Go to the catalogue
      </Link>
    </div>
  );
}
