import { flat, stroke } from "./rig.mjs";

/** Stature only sets relative proportions in the art. It never reaches the app. */
const CM_TO_UNITS = 3.4;
const toStature = (cm) => Math.round(300 + (cm - 160) * CM_TO_UNITS);

const BLACK_HAIR = { base: "#221A33", light: "#4A3D66" };
const BLOND_HAIR = { base: "#F2C43D", light: "#FFE68A" };
const BROWN_HAIR = { base: "#6B4226", light: "#96653F" };
const DEEP_BROWN_HAIR = { base: "#3B2216", light: "#5C3A26" };
const DARK_HAIR = { base: "#3A2340", light: "#62406B" };

const DARK_EYES = "#4A2E22";
const CELESTE_EYES = "#58BDF0";

const standardBuild = { shoulders: 84, hips: 66 };
const shortBuild = { shoulders: 72, hips: 62 };

const neck = (fill) => ({ y, center }) =>
  `<path d="M${center - 20} ${y + 1}q20 16 40 0" fill="none" stroke="${fill}" stroke-width="7" stroke-linecap="round"/>`;

const pearls = ({ y, center }) =>
  `<path d="M${center - 22} ${y + 2}q22 22 44 0" fill="none" stroke="#FFF8EC" stroke-width="5" stroke-dasharray="0.1 6" stroke-linecap="round"/>`;

const BLACK_TEE = "#1C1A22";

function star(cx, cy, radius) {
  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = (Math.PI / 5) * index - Math.PI / 2;
    const length = index % 2 === 0 ? radius : radius * 0.45;
    return `${(cx + Math.cos(angle) * length).toFixed(1)} ${(cy + Math.sin(angle) * length).toFixed(1)}`;
  });
  return `<path d="M${points.join("L")}Z" fill="#F4F4F8" stroke="#1E1033" stroke-width="1.5" stroke-linejoin="round"/>`;
}

export const CAST = [
  {
    id: "rama",
    name: "Rama",
    stature: toStature(176),
    build: { shoulders: 108, hips: 84 },
    hair: { style: "fade", ...BLACK_HAIR },
    face: {
      eyes: { iris: DARK_EYES, relaxed: true },
      brow: BLACK_HAIR.base,
      browBar: "#D9DCE3",
      beard: "#2B2233",
      nose: "small",
      mouth: "smirk",
    },
    outfit: {
      color: "#2A2533",
      shade: "#0F0B16",
      hem: 10,
      draw: ({ top, bottom, center }) =>
        [
          flat(`M${center - 70} ${bottom - 12}H${center + 70}V${bottom + 8}H${center - 70}Z`, "#1C1824"),
          flat(`M${center - 28} ${top + 82}h56l8 30h-72z`, "#1C1824"),
          ...[-30, -10, 10, 30].map((offset, index) =>
            star(center + offset, top + 62 - (index === 1 || index === 2 ? 6 : 0), 8),
          ),
        ].join(""),
      collar: ({ y, center }) =>
        [
          `<path d="M${center - 34} ${y + 2}q34 30 68 0" fill="none" stroke="#1E1033" stroke-width="22" stroke-linecap="round"/>`,
          `<path d="M${center - 34} ${y + 2}q34 30 68 0" fill="none" stroke="#2A2533" stroke-width="14" stroke-linecap="round"/>`,
          `<path d="M${center - 16} ${y + 6}q16 22 32 0" fill="none" stroke="#D9DCE3" stroke-width="3.5" stroke-dasharray="4 2"/>`,
        ].join(""),
    },
    arms: { color: "#2A2533", width: 27, cuff: "#D9DCE3", cuffOffset: 116 },
    legs: { color: "#A9A9B6", shade: "#7C7C8C", width: 42, flare: 6, hem: 330, shoe: "#F4F4F8" },
    pose: { left: "hip", right: "down" },
    accessory: null,
    companion: "bud",
  },
  {
    id: "aguysan",
    name: "Aguysan",
    stature: toStature(185),
    build: standardBuild,
    hair: { style: "sweep", ...BROWN_HAIR },
    face: {
      eyes: { iris: DARK_EYES },
      brow: BROWN_HAIR.base,
      nose: "large",
      mouth: "smile",
    },
    outfit: {
      color: "#FFFFFF",
      shade: "#A9A6C4",
      hem: 6,
      draw: ({ top, center }) =>
        `<path d="M${center - 34} ${top + 48}l16 26l14 -26M${center + 4} ${top + 48}h30" fill="none" stroke="${BLACK_TEE}" stroke-width="7" stroke-linejoin="round"/>`,
      collar: neck("#D9D6E8"),
    },
    arms: { color: "#FFFFFF", width: 19, cuff: "#D9D6E8", cuffOffset: 62 },
    legs: { color: "#3B4A63", shade: "#24304A", width: 32, flare: 2, shoe: "#FFFFFF" },
    pose: { left: "hip", right: "hip" },
    accessory: null,
    companion: "poodle",
    companionSpot: "ground",
  },
  {
    id: "nehue",
    name: "Nehue",
    stature: toStature(176),
    build: { shoulders: 112, hips: 62 },
    hair: { style: "fringe", ...DARK_HAIR },
    face: {
      eyes: { iris: DARK_EYES },
      brow: DARK_HAIR.base,
      nose: "small",
      mouth: "smile",
    },
    outfit: {
      color: BLACK_TEE,
      shade: "#0B0A10",
      collar: neck("#2E2B38"),
    },
    arms: { color: "#F4C7A1", width: 25, handSize: 13 },
    legs: { color: "#2A2733", shade: "#16141C", width: 34, flare: 3, hem: 340, shoe: "#FFFFFF" },
    pose: { left: "hip" },
    companion: "shepherd",
    companionSpot: "ground",
    accessory: "dumbbell",
  },
  {
    id: "pili",
    name: "Pili",
    stature: toStature(160),
    build: shortBuild,
    hair: { style: "long", ...DEEP_BROWN_HAIR },
    face: {
      eyes: { iris: DARK_EYES },
      brow: DEEP_BROWN_HAIR.base,
      glasses: "#1E1033",
      nose: "small",
      mouth: "smile",
    },
    outfit: {
      color: "#221C2E",
      shade: "#0F0B16",
      hem: 22,
      draw: ({ top, bottom, center }) =>
        [
          flat(`M${center - 70} ${bottom - 26}H${center + 70}V${bottom + 12}H${center - 70}Z`, "#FF62AB"),
          stroke(`M${center - 22} ${bottom - 24}l-3 34M${center} ${bottom - 24}v34M${center + 22} ${bottom - 24}l3 34`, "#C62E7B", 3),
          flat(`M${center - 70} ${bottom - 28}H${center + 70}v5H${center - 70}Z`, "#FFD12F"),
          stroke(`M${center - 16} ${top + 34}l4 4m0 -4l-4 4M${center + 12} ${top + 46}l4 4m0 -4l-4 4M${center - 4} ${top + 58}l4 4m0 -4l-4 4`, "#FFD12F", 2.5),
        ].join(""),
      collar: ({ y, center }) =>
        `<path d="M${center - 18} ${y + 4}q18 16 36 0" fill="none" stroke="#FFD12F" stroke-width="3"/><circle cx="${center}" cy="${y + 13}" r="3.5" fill="#FFD12F"/>`,
    },
    arms: { color: "#F4C7A1", width: 17, cuff: "#FFD12F", cuffOffset: 100 },
    legs: {
      color: "#F4C7A1",
      shade: "#E0A67F",
      width: 28,
      flare: 1,
      hem: 368,
      sock: "#2A1F3D",
      shoe: "#2A1F3D",
    },
    pose: { left: "wave" },
    companion: "guineaPig",
    companionSpot: "ground",
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
      color: "#FFFFFF",
      shade: "#B9B4D0",
      hem: 4,
      draw: ({ top, bottom, center }) =>
        stroke(`M${center - 22} ${top - 2}L${center + 30} ${bottom + 6}`, BLACK_TEE, 7),
      collar: pearls,
    },
    arms: { color: "#FFFFFF", width: 17 },
    legs: { color: "#2F3A55", shade: "#1C2438", width: 30, flare: 2, shoe: "#FFFFFF" },
    pose: { left: "hip" },
    accessory: "cigarette",
  },
  {
    id: "chino",
    name: "Chino",
    stature: toStature(180),
    build: standardBuild,
    hair: { style: "tousled", ...DARK_HAIR },
    face: {
      eyes: { iris: DARK_EYES },
      brow: DARK_HAIR.base,
      nose: "small",
      mouth: "smile",
    },
    outfit: {
      color: "#E9D5B3",
      shade: "#B89C72",
      hem: 2,
      draw: ({ top, center }) =>
        [-30, -10, 10, 30]
          .map((offset, index) => flat(`M${center + offset - 8} ${top + 58 + (index % 2) * 4}h16v22h-16z`, "#D8262F"))
          .join(""),
      collar: neck("#B89C72"),
    },
    arms: { color: "#E9D5B3", width: 19, cuff: "#B89C72", cuffOffset: 62 },
    legs: { color: "#3C3560", shade: "#262043", width: 34, flare: 3, hem: 330, sock: "#FFFFFF", shoe: "#E5243B", step: true },
    pose: { left: "down" },
    accessory: null,
  },
  {
    id: "agusmaxi",
    name: "Agusmaxi",
    stature: toStature(185),
    build: standardBuild,
    hair: { style: "crop", ...BROWN_HAIR },
    face: {
      eyes: { iris: DARK_EYES },
      brow: BROWN_HAIR.base,
      nose: "small",
      mouth: "smile",
    },
    outfit: {
      color: "#FFFFFF",
      shade: "#9FB0D8",
      hem: 4,
      draw: ({ top, center }) =>
        `<path d="M${center - 46} ${top + 2}L${center} ${top + 82}L${center + 46} ${top + 2}" fill="none" stroke="#1F4FC8" stroke-width="20"/>`,
      collar: ({ y, center }) =>
        `<path d="M${center - 22} ${y + 1}q22 16 44 0" fill="none" stroke="#1F4FC8" stroke-width="7" stroke-linecap="round"/><path d="M${center - 22} ${y + 1}q22 16 44 0" fill="none" stroke="#FFFFFF" stroke-width="2"/>`,
    },
    arms: { color: "#FFFFFF", width: 19, cuff: "#1F4FC8", cuffOffset: 62 },
    legs: { color: "#2F3A55", shade: "#1C2438", width: 32, flare: 2, shoe: "#FFFFFF" },
    pose: { left: "wave" },
    accessory: "burger",
  },
];
