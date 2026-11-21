import { Hero } from "@/components/hero";
import { SmoothScroll } from "@/components/motion";
import { About, Closing, How, OpenSource, Patterns, Phones, Sizes, Why } from "@/components/sections";

export default function Page() {
  return (
    <main>
      <SmoothScroll />
      <Hero />
      <Why />
      <How />
      <Patterns />
      <Sizes />
      <div className="mt-32 sm:mt-40">
        <Phones />
      </div>
      <OpenSource />
      <About />
      <Closing />
    </main>
  );
}
