import { OpeningHours } from "@/components/opening-hours";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

interface Step {
  id: string;
  title: string;
  text: string;
}

// A first visit, in the order it happens, which is why it is an <ol>.
const FIRST_VISIT: Step[] = [
  {
    id: "gate",
    title: "Find the library",
    text: "The library is the back room of the neighbourhood centre. Come in through the garden gate, where there are no steps.",
  },
  {
    id: "pick",
    title: "Borrow a packet",
    text: "Pick a variety from the shelf and take one packet of its seed home.",
  },
  {
    id: "return",
    title: "Bring seed back",
    text: "Save seed from your best plants and bring some back at the end of the season.",
  },
];

export default function VisitPage() {
  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      <header className="flex flex-col gap-2">
        <p className="font-medium text-moss text-sm uppercase tracking-widest">
          Visit the library
        </p>
        <h1 className="font-semibold text-4xl text-ink sm:text-5xl">
          Come and borrow a packet
        </h1>
        <Text className="max-w-prose text-bark text-lg">
          Where the library is, when its door is open, and what to bring the
          first time.
        </Text>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col gap-3">
          <h2 className="font-semibold text-ink text-lg">
            Where the library is
          </h2>
          <Text className="text-bark">
            The back room of the neighbourhood centre. Come in through the
            garden gate, where there are no steps.
          </Text>
        </Card>
        <Card className="flex flex-col gap-3">
          <h2 className="font-semibold text-ink text-lg">When it is open</h2>
          <OpeningHours />
        </Card>
        <Card className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
          <h2 className="font-semibold text-ink text-lg">What to bring</h2>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-3 text-ink">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full bg-moss"
              />
              A bag
            </li>
            <li className="flex items-center gap-3 text-ink">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full bg-moss"
              />
              A pencil
            </li>
          </ul>
          <Text variant="muted">Nothing else. Seed is lent, never sold.</Text>
        </Card>
      </div>
      <section className="flex flex-col gap-5">
        <h2 className="font-semibold text-2xl text-ink">Your first visit</h2>
        <ol className="grid gap-6 border-line border-y py-6 sm:grid-cols-3 sm:gap-8">
          {FIRST_VISIT.map((step, index) => (
            <li key={step.id} className="flex gap-4 sm:flex-col sm:gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-moss font-semibold text-card">
                {index + 1}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-ink text-lg">{step.title}</h3>
                <Text className="text-bark">{step.text}</Text>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
