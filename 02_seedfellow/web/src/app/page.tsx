import { Suspense } from "react";
import { Catalogue } from "@/components/catalogue";
import { Hero } from "@/components/hero";
import { Text } from "@/components/ui/text";

// The home page is a server component: it renders on the server, which is what lets Catalogue wait
// for its data. Hero is plain markup. The page only decides the order.
// The catalogue waits for the API on every request, so it sits in <Suspense>: the hero and
// the frame show at once and the cards stream in behind the fallback.
export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <Hero />
      <Suspense fallback={<Text variant="muted">Opening the catalogue.</Text>}>
        <Catalogue />
      </Suspense>
    </div>
  );
}
