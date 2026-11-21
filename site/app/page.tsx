import { Hero } from "@/components/hero";
import { SmoothScroll } from "@/components/motion";
import { ScrollFx } from "@/components/scrollfx";
import { About, Closing, Grounds, How, OpenSource, Patterns, Phones, Saves, Sizes, Why } from "@/components/sections";

export default function Page() {
  return (
    <main>
      <SmoothScroll />
      <Hero />
      <Why />
      <Saves />
      <How />
      <Patterns />
      <Sizes />
      <Grounds />
      <Phones />
      <OpenSource />
      <About />
      <Closing />
      <ScrollFx />
    </main>
  );
}
