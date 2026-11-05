import { SortijaIcon } from "@/components/brand/sortija-icon";

const SLOGAN = "La juntada sigue girando";
const REPEATS = Array.from({ length: 8 }, (_, index) => index);

function SloganRun() {
  return (
    <div className="flex shrink-0 items-center">
      {REPEATS.map((index) => (
        <span key={index} className="flex items-center gap-6 pr-6">
          {SLOGAN}
          <SortijaIcon className="size-6" />
        </span>
      ))}
    </div>
  );
}

/** The slogan on a turning sign. Two identical runs make the loop seamless. */
export function SloganMarquee() {
  return (
    <div className="relative -left-[2%] w-[104%] -rotate-1 overflow-hidden bg-brand-yellow py-3 font-logo text-2xl text-brand-ink md:text-3xl">
      <p className="sr-only">{SLOGAN}.</p>
      <div aria-hidden="true" className="flex w-max animate-marquee motion-reduce:animate-none">
        <SloganRun />
        <SloganRun />
      </div>
    </div>
  );
}
