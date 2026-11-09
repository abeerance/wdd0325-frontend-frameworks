import Link from "next/link";
import { Logo } from "@/components/logo";
import { Text } from "@/components/ui/text";
import { OpeningHours } from "./opening-hours";

// The bottom of every page. It sits in the root layout after <main>, directly in the
// <body>, which is what makes it the page's contentinfo landmark.
export function SiteFooter() {
  return (
    <footer className="border-line border-t bg-card">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <section className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <Logo />
          <Text className="max-w-prose text-bark">
            A neighbourhood seed library of heritage varieties. Borrow a packet,
            grow it, and bring some of its seed back at the end of the season.
          </Text>
          <Text className="border-moss border-l-2 pl-3 font-medium text-moss">
            Seed is lent, never sold.
          </Text>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-ink">Where to find us</h2>
          <Text className="text-bark">
            The back room of the neighbourhood centre. Come in through the
            garden gate, where there are no steps.
          </Text>
          <Link
            href="/visit"
            className="inline-flex min-h-11 items-center self-start rounded-sm font-medium text-moss text-sm underline underline-offset-4 hover:text-moss-deep focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2"
          >
            Plan your first visit
          </Link>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-ink">When we are open</h2>
          <OpeningHours />
        </section>
      </div>

      <div className="border-line border-t">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6">
          <Text className="text-bark text-sm">
            Every photograph is credited on the page that shows it, under its
            own licence.
          </Text>
        </div>
      </div>
    </footer>
  );
}
