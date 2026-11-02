import { Catalogue } from "@/components/catalogue";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <Hero />
      <Catalogue />
    </div>
  );
}
