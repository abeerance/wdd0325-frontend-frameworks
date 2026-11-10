"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const LINKS = [
  { href: "/", label: "Catalogue" },
  { href: "/about", label: "How it works" },
  { href: "/visit", label: "Visit" },
];

function NavLinks({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex flex-wrap gap-1">
      {LINKS.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            // aria-current tells a screen reader which page you are on. The class below
            // reads the same attribute, so the visible marking and the spoken one
            // cannot drift apart.
            aria-current={pathname === link.href ? "page" : undefined}
            className="inline-flex min-h-11 items-center rounded-full px-4 font-medium text-bark text-sm transition-colors hover:bg-dew hover:text-ink focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2 aria-[current=page]:bg-dew aria-[current=page]:text-moss-deep"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// The only part that asks which page is showing, so the only part that waits for it.
// With cacheComponents, usePathname suspends on a route whose param is unknown until the
// request, which /varieties/[id] is now that generateStaticParams is gone. The Suspense
// below keeps that wait from blocking the rest of the layout.
function CurrentNavLinks() {
  return <NavLinks pathname={usePathname()} />;
}

// A client component, because it asks the browser which page is showing and has to answer
// again every time that changes. The layout around it never re-renders on navigation.
export function SiteNav() {
  return (
    <nav aria-label="Main">
      {/* Fallback: the same links with none marked current, so nothing shifts when the path arrives. */}
      <Suspense fallback={<NavLinks pathname={null} />}>
        <CurrentNavLinks />
      </Suspense>
    </nav>
  );
}
