import { Logo } from "@/components/logo";
import { Text } from "@/components/ui/text";

interface Opening {
  id: string;
  day: string;
  hours: string;
}

// When the library's door is open. Day and hours are a name and its value, which is
// what a <dl> is for. Each pair sits in its own <div>, which HTML allows inside a <dl>,
// so a pair can be laid out as one row.
const OPENINGS: Opening[] = [
  { id: "wednesday", day: "Wednesday", hours: "17:30 to 19:30" },
  { id: "saturday", day: "Saturday", hours: "10:00 to 13:00" },
];

// The bottom of every page. It sits in the root layout after <main>, directly in the
// <body>, which is what makes it the page's contentinfo landmark.
export function Footer() {
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
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-ink">When we are open</h2>
          <dl className="flex max-w-64 flex-col gap-2">
            {OPENINGS.map((opening) => (
              <div key={opening.id} className="flex justify-between gap-6">
                <dt className="text-ink">{opening.day}</dt>
                <dd className="text-bark tabular-nums">{opening.hours}</dd>
              </div>
            ))}
          </dl>
          <Text variant="muted">Closed on public holidays.</Text>
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
