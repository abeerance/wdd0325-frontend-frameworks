import type { Variety } from "@/data/varieties";
import { Text } from "./ui/text";

interface PacketLineProps {
  variety: Variety;
}

// How many packets are left, or that there never will be again. The catalogue card and the
// variety's own page both say it, so it has a file of its own.
export function PacketLine({ variety }: PacketLineProps) {
  // Early return: the retired case is answered first, the rest is the normal case.
  if (variety.retired) {
    return (
      <Text className="mt-2 font-medium text-sm text-amber-700">
        Retired from the library
      </Text>
    );
  }

  return (
    <Text className="mt-2 font-medium text-sm">
      {variety.packets} {variety.packets === 1 ? "packet" : "packets"} on the
      shelf
    </Text>
  );
}
