import { Text } from "@/components/ui/text";

// Shown by notFound() in the variety page. It sits beside the page, so the varieties
// layout still wraps it: "Back to the catalogue" is already on screen and needs no link of
// its own. It takes no props and cannot know which id was missing, so it is written for the
// situation, not for the address.
export default function VarietyNotFound() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-semibold text-4xl text-ink sm:text-5xl">
        No such variety
      </h1>
      <Text>The library has never held that one.</Text>
    </div>
  );
}
