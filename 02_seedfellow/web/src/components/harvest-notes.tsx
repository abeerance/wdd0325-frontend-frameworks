import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { getVariety } from "@/lib/varieties";

interface HarvestNotesProps {
  id: string;
}

const PERCENT = new Intl.NumberFormat("en-GB", { style: "percent" });
// written_on is a date without a time. Formatting in UTC stops the day from shifting by
// the server's own time zone.
const DAY = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeZone: "UTC",
});

// What members reported after growing this variety: the share of seeds that came up, then
// each member's note. A server component, so it fetches its own data from the id.
export async function HarvestNotes({ id }: HarvestNotesProps) {
  const variety = await getVariety(id);
  // Null while no note exists, which is different from 0%: nothing was reported, not nothing grew.
  const rate = variety?.germination_rate ?? null;
  const notes = variety?.harvest_notes ?? [];

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-semibold text-2xl text-ink">Harvest notes</h2>
      {rate === null ? null : (
        <Text>{PERCENT.format(rate)} of the seed members sowed came up.</Text>
      )}
      {notes.length === 0 ? (
        <Text variant="muted">No harvest reports yet.</Text>
      ) : (
        <ul className="flex flex-col gap-4">
          {notes.map((note) => (
            <li key={note.id}>
              <Card as="article" className="flex flex-col gap-2">
                <Text>{note.body}</Text>
                <Text className="font-medium">
                  {note.seeds_germinated} of {note.seeds_sown} seeds came up.
                </Text>
                <Text variant="muted">
                  {note.grown_by}, {DAY.format(new Date(note.written_on))}
                </Text>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
