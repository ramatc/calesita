import type { DurationBucket, MaterialFilter } from "@/games/catalog-query";
import type {
  GameCategory,
  GameDifficulty,
  GameMaterial,
  GameStatus,
  NumericRange,
} from "@/types/game";

export const CATEGORY_LABELS: Record<GameCategory, string> = {
  classic: "Clásicos",
  social: "Sociales",
  physical: "Desafíos físicos",
};

export const CATEGORY_DESCRIPTIONS: Record<GameCategory, string> = {
  classic: "Los de siempre, con reloj y equipos.",
  social: "Para reírse del grupo y descubrir quién miente.",
  physical: "Para levantarse del sillón.",
};

export const DIFFICULTY_LABELS: Record<GameDifficulty, string> = {
  easy: "Fácil",
  medium: "Media",
  hard: "Difícil",
};

export const STATUS_LABELS: Record<GameStatus, string> = {
  available: "Disponible",
  "coming-soon": "Próximamente",
};

export const DURATION_LABELS: Record<DurationBucket, string> = {
  short: "Hasta 20 min",
  medium: "20 a 30 min",
  long: "Más de 30 min",
};

export const MATERIAL_FILTER_LABELS: Record<MaterialFilter, string> = {
  none: "Sin materiales",
  paper: "Papel y lapicera",
  "household-objects": "Cosas de la casa",
};

const MATERIAL_LABELS: Record<GameMaterial, string> = {
  paper: "Papel y lapicera",
  "household-objects": "Cosas de la casa",
};

export function formatMaterials(materials: readonly GameMaterial[]) {
  if (materials.length === 0) return "Solo este dispositivo";
  return materials.map((material) => MATERIAL_LABELS[material]).join(", ");
}

export function formatPlayers({ min, max }: NumericRange) {
  return `${min} a ${max} jugadores`;
}

export function formatDuration({ min, max }: NumericRange) {
  return `${min} a ${max} min`;
}
