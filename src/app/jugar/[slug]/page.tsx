import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getGameBySlug } from "@/content/catalog";
import { GAME_SCREENS } from "@/games/registry";
import type { GameSlug } from "@/types/game";

type PlayPageProps = PageProps<"/jugar/[slug]">;

// Only registered games can be played, so anything else is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(GAME_SCREENS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
  const game = getGameBySlug((await params).slug);
  return game ? { title: game.name } : {};
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const Screen = GAME_SCREENS[slug as GameSlug];
  if (!Screen) notFound();

  return <Screen />;
}
