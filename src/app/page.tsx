import { CarouselIllustration } from "@/components/brand/carousel-illustration";
import { Logo } from "@/components/brand/logo";

export default function HomePage() {
  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-5 py-10 md:grid-cols-2 md:gap-12">
      <section className="text-center md:text-left">
        <h1>
          <Logo className="text-7xl md:text-8xl" />
        </h1>
        <p className="mt-5 text-2xl font-semibold md:text-3xl">
          La juntada sigue girando.
        </p>
        <p className="mt-3 text-lg text-muted-foreground">
          Estamos armando la calesita. Muy pronto vas a poder elegir un juego y
          empezar.
        </p>
      </section>

      <CarouselIllustration className="mx-auto max-w-md md:max-w-none" />
    </main>
  );
}
