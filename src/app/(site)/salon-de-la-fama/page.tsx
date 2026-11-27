import type { Metadata } from "next";

import { HallOfFame } from "@/components/hall-of-fame/hall-of-fame";

export const metadata: Metadata = {
  title: "Salón de la Fama",
  description: "Ranking, estadísticas y logros de la ronda, calculados con las partidas jugadas.",
};

export default function HallOfFamePage() {
  return <HallOfFame />;
}
