import { Text } from "@/components/ui/text";
import type { Variety } from "@/lib/types";

interface PacketLineProps {
  variety: Variety;
}

// How many packets are left, or that there never will be again. The catalogue card and the
// variety's own page both say it, so it has a file of its own.
export function PacketLine({ variety }: PacketLineProps) {
  // Early return: the retired case is answered first, the rest is the normal case.
  if (variety.retired) {
    return (
      <Text className="font-medium text-sm text-amber-700">
        Retired from the library
      </Text>
    );
  }

  return (
    <Text className="font-medium text-sm">
      {variety.packets} {variety.packets === 1 ? "packet" : "packets"} on the
      shelf
    </Text>
  );
}
