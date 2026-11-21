import { Hero } from "@/components/hero";
import { SmoothScroll } from "@/components/motion";
import { About, Closing, How, Patterns, Phones, Sizes, Why } from "@/components/sections";

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
      <About />
      <Closing />
    </main>
  );
}
