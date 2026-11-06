import { flat, stroke } from "./rig.mjs";

/** Stature only sets relative proportions in the art. It never reaches the app. */
const CM_TO_UNITS = 3.4;
const toStature = (cm) => Math.round(300 + (cm - 160) * CM_TO_UNITS);

const BLACK_HAIR = { base: "#221A33", light: "#4A3D66" };
const BLOND_HAIR = { base: "#F2C43D", light: "#FFE68A" };
const BROWN_HAIR = { base: "#6B4226", light: "#96653F" };
const DARK_HAIR = { base: "#3A2340", light: "#62406B" };
const LIGHT_BROWN_HAIR = { base: "#A8763A", light: "#D1A365" };

const DARK_EYES = "#4A2E22";
const CELESTE_EYES = "#58BDF0";

const standardBuild = { shoulders: 84, hips: 66 };
const shortBuild = { shoulders: 72, hips: 62 };

const neck = (fill) => ({ y, center }) =>
  `<path d="M${center - 20} ${y + 1}q20 16 40 0" fill="none" stroke="${fill}" stroke-width="7" stroke-linecap="round"/>`;

export const CAST = [
  {
    id: "rama",
    name: "Rama",
    stature: toStature(176),
    build: { shoulders: 100, hips: 84 },
    hair: { style: "crop", ...BLACK_HAIR },
    face: {
      eyes: { iris: DARK_EYES, relaxed: true },
      brow: BLACK_HAIR.base,
      browCut: "left",
      browRing: "#FFD12F",
      nose: "small",
      mouth: "smirk",
    },
    outfit: {
      color: "#7B4DFF",
      shade: "#3B1FA8",
      hem: 26,
      draw: ({ top, bottom, center }) =>
        [
          flat(`M${center - 70} ${bottom - 14}H${center + 70}V${bottom + 8}H${center - 70}Z`, "#FFD12F"),
          flat(`M${center - 26} ${top + 72}h52l8 34h-68z`, "#5B2FE0"),
          stroke(`M${center - 9} ${top + 8}v30M${center + 9} ${top + 8}v22`, "#FFD12F", 4),
        ].join(""),
      collar: neck("#FFD12F"),
    },
    arms: { color: "#7B4DFF", width: 25, cuff: "#FFD12F", cuffOffset: 118 },
    legs: { color: "#4D4378", shade: "#2F2752", width: 42, flare: 7, shoe: "#FFD12F" },
    accessory: null,
  },
  {
    id: "aguysan",
    name: "Aguysan",
    stature: toStature(185),
    build: standardBuild,
    hair: { style: "sweep", ...BLOND_HAIR },
    face: {
      eyes: { iris: DARK_EYES },
      brow: "#C4932A",
      nose: "large",
      mouth: "smile",
    },
    outfit: {
      color: "#FF8A3D",
      shade: "#C85412",
      hem: 6,
      draw: ({ top, center, bottom }) =>
        flat(`M${center - 14} ${top}h28v${bottom - top + 12}h-28z`, "#FFF1D6"),
      collar: neck("#FFF1D6"),
    },
    arms: { color: "#FF8A3D", width: 19, cuff: "#FFF1D6", cuffOffset: 110 },
    legs: { color: "#FFF1D6", shade: "#D9BE94", width: 32, flare: 2, shoe: "#C85412" },
    accessory: null,
  },
  {
    id: "nehue",
    name: "Nehue",
    stature: toStature(176),
    build: { shoulders: 112, hips: 62 },
    hair: { style: "fringe", ...BROWN_HAIR },
    face: {
      eyes: { iris: DARK_EYES },
      brow: BROWN_HAIR.base,
      nose: "small",
      mouth: "smile",
    },
    outfit: {
      color: "#FFFFFF",
      shade: "#7FA9C9",
      draw: ({ top, bottom, center }) =>
        [-40, -14, 12, 38]
          .map((offset) => flat(`M${center + offset - 7} ${top - 2}h14v${bottom - top + 10}h-14z`, "#6CC5F0"))
          .join(""),
      collar: neck("#6CC5F0"),
    },
    arms: { color: "#F4C7A1", width: 25, handSize: 13 },
    legs: { color: "#2F6FA8", shade: "#1C4770", width: 34, flare: 3, hem: 340, shoe: "#FFFFFF" },
    accessory: "dumbbell",
  },
  {
    id: "pili",
    name: "Pili",
    stature: toStature(160),
    build: shortBuild,
    hair: { style: "bob", ...DARK_HAIR },
    face: {
      eyes: { iris: DARK_EYES },
      brow: DARK_HAIR.base,
      glasses: "#7A1F3D",
      nose: "small",
      mouth: "smile",
    },
    outfit: {
      color: "#FF62AB",
      shade: "#C62E7B",
      hem: 4,
      draw: ({ top, center }) =>
        flat(`M${center - 40} ${top + 34}h80v9h-80z M${center - 40} ${top + 50}h80v9h-80z`, "#7A1F3D"),
      collar: neck("#7A1F3D"),
    },
    arms: { color: "#FF62AB", width: 17, cuff: "#7A1F3D", cuffOffset: 104 },
    legs: { color: "#7A1F3D", shade: "#4C1026", width: 30, flare: 2, shoe: "#FF62AB" },
    accessory: "beer",
  },
  {
    id: "piku",
    name: "Piku",
    stature: toStature(160),
    build: shortBuild,
    hair: { style: "long", ...BLOND_HAIR },
    face: {
      eyes: { iris: CELESTE_EYES, relaxed: true },
      brow: "#C4932A",
      nose: "small",
      mouth: "smirk",
    },
    outfit: {
      color: "#FFF0A8",
      shade: "#D9BE5E",
      hem: 4,
      draw: ({ top, bottom, center }) =>
        [
          flat(`M${center - 30} ${top + 34}h60v${bottom - top}h-60z`, "#31D4C5"),
          stroke(`M${center - 24} ${top + 38}L${center - 26} ${top - 4}M${center + 24} ${top + 38}L${center + 26} ${top - 4}`, "#31D4C5", 9),
          flat(`M${center - 13} ${top + 48}h26v20h-26z`, "#1FA899"),
        ].join(""),
      collar: neck("#FFF0A8"),
    },
    arms: { color: "#FFF0A8", width: 17 },
    legs: { color: "#31D4C5", shade: "#1A9488", width: 30, flare: 2, shoe: "#FFF0A8" },
    accessory: null,
  },
  {
    id: "chino",
    name: "Chino",
    stature: toStature(180),
    build: standardBuild,
    hair: { style: "tousled", ...BROWN_HAIR },
    face: {
      eyes: { iris: DARK_EYES },
      brow: BROWN_HAIR.base,
      nose: "small",
      mouth: "smile",
    },
    outfit: {
      color: "#FFFFFF",
      shade: "#A9A6C4",
      hem: 2,
      draw: ({ top, bottom, center }) =>
        `<path d="M${center - 60} ${top + 2}L${center + 56} ${bottom + 4}" stroke="#E5243B" stroke-width="26"/>`,
      collar: neck("#E5243B"),
    },
    arms: { color: "#FFFFFF", width: 19, cuff: "#E5243B", cuffOffset: 62 },
    legs: { color: "#3C3560", shade: "#262043", width: 34, flare: 3, hem: 330, sock: "#FFFFFF", shoe: "#E5243B" },
    accessory: "ball",
  },
  {
    id: "agusmaxi",
    name: "Agusmaxi",
    stature: toStature(185),
    build: standardBuild,
    hair: { style: "waves", ...LIGHT_BROWN_HAIR },
    face: {
      eyes: { iris: DARK_EYES },
      brow: "#7D5426",
      nose: "small",
      mouth: "smile",
    },
    outfit: {
      color: "#FFFFFF",
      shade: "#9FB0D8",
      hem: 4,
      draw: ({ top, center }) =>
        `<path d="M${center - 46} ${top + 2}L${center} ${top + 88}L${center + 46} ${top + 2}" fill="none" stroke="#2B5FD9" stroke-width="20"/>`,
      collar: neck("#2B5FD9"),
    },
    arms: { color: "#FFFFFF", width: 19, cuff: "#2B5FD9", cuffOffset: 62 },
    legs: { color: "#2B5FD9", shade: "#183A90", width: 32, flare: 2, shoe: "#FFFFFF" },
    accessory: "burger",
  },
];
