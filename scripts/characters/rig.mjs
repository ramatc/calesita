/**
 * Shared character rig. Every Calesita character is the same drawing with
 * different parameters, which is what keeps the seven visually consistent:
 * one head, one eye, one outline weight, one shadow treatment.
 *
 * All full-body art shares one canvas and one ground line, so characters keep
 * their relative proportions wherever they are shown side by side.
 */

export const CANVAS = { width: 260, height: 420, ground: 408 };

const INK = "#1E1033";
const SKIN = "#F4C7A1";
const SKIN_SHADE = "#E0A67F";
const OUTLINE = 4;
const CENTER = CANVAS.width / 2;
const HEAD = { width: 104, height: 106 };

const line = `stroke="${INK}" stroke-width="${OUTLINE}" stroke-linejoin="round" stroke-linecap="round"`;
const thin = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

const shape = (d, fill) => `<path d="${d}" fill="${fill}" ${line}/>`;
const flat = (d, fill, opacity = 1) => `<path d="${d}" fill="${fill}" opacity="${opacity}"/>`;
const stroke = (d, color = INK, width = 3) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;

function roundedBox(x, y, width, height, radius) {
  return `M${x + radius} ${y}h${width - radius * 2}q${radius} 0 ${radius} ${radius}v${height - radius * 2}q0 ${radius} -${radius} ${radius}h-${width - radius * 2}q-${radius} 0 -${radius} -${radius}v-${height - radius * 2}q0 -${radius} ${radius} -${radius}z`;
}

/* Layout: every vertical position derives from the character's stature. */
function getLayout({ stature, build }) {
  const top = CANVAS.ground - stature;
  const head = { x: CENTER, y: top + HEAD.height / 2 + 6 };
  const shoulderY = head.y + HEAD.height / 2 + 2;
  const legLength = Math.round((stature - HEAD.height - 12) * 0.46);
  const hipY = CANVAS.ground - legLength;
  const shoulder = build.shoulders / 2;
  const hip = build.hips / 2;

  return { top, head, shoulderY, hipY, shoulder, hip };
}

/* Body */

function drawLegs({ hipY, hip }, { legs }) {
  const ground = CANVAS.ground;
  const gap = 5;
  const width = legs.width;
  const knee = legs.hem ?? ground - 12;
  const left = `M${CENTER - hip + 1} ${hipY - 6}L${CENTER - hip - legs.flare} ${knee}H${CENTER - hip - legs.flare + width}L${CENTER - gap} ${hipY + 20}L${CENTER - gap} ${hipY - 6}Z`;
  const right = `M${CENTER + hip - 1} ${hipY - 6}L${CENTER + hip + legs.flare} ${knee}H${CENTER + hip + legs.flare - width}L${CENTER + gap} ${hipY + 20}L${CENTER + gap} ${hipY - 6}Z`;
  const legLeft = CENTER - hip + 2;
  const legRight = CENTER + hip - 2 - width + 8;

  let skin = "";
  if (legs.hem) {
    const calfWidth = width - 8;
    const sock = legs.sock;
    skin = [
      shape(`M${legLeft} ${knee - 4}h${calfWidth}v${ground - knee - 2}h-${calfWidth}z`, sock ?? SKIN),
      shape(`M${legRight} ${knee - 4}h${calfWidth}v${ground - knee - 2}h-${calfWidth}z`, sock ?? SKIN),
    ].join("");
  }

  const shoe = (x, direction) => {
    const heel = x - direction * 13;
    const toe = direction * 30;
    return shape(
      `M${heel} ${ground}v-13q0 -7 ${direction * 7} -7h${direction * 12}q${toe * 0.62} 3 ${toe - direction * 2} 14q${direction * 2} 3 0 6z`,
      legs.shoe,
    );
  };

  return [
    `<ellipse cx="${CENTER}" cy="${ground + 2}" rx="${hip + 34}" ry="7" fill="${INK}" opacity="0.28"/>`,
    skin,
    shape(left, legs.color),
    shape(right, legs.color),
    flat(`M${CENTER + gap + 2} ${hipY + 22}L${CENTER + hip + legs.flare - width + 8} ${knee - 2}H${CENTER + hip + legs.flare - 2}L${CENTER + hip - 4} ${hipY}Z`, legs.shade, 0.55),
    shoe(legLeft + (width - 8) / 2 - 2, -1),
    shoe(legRight + (width - 8) / 2 + 2, 1),
  ].join("");
}

function torsoPath({ shoulderY, hipY, shoulder, hip }, { hem = 0 }) {
  const bottom = hipY + hem;
  return `M${CENTER - shoulder + 12} ${shoulderY}Q${CENTER - shoulder} ${shoulderY + 2} ${CENTER - shoulder} ${shoulderY + 18}L${CENTER - hip} ${bottom}Q${CENTER} ${bottom + 6} ${CENTER + hip} ${bottom}L${CENTER + shoulder} ${shoulderY + 18}Q${CENTER + shoulder} ${shoulderY + 2} ${CENTER + shoulder - 12} ${shoulderY}Z`;
}

function drawArm(layout, side, arm) {
  const direction = side === "left" ? -1 : 1;
  const startX = CENTER + direction * (layout.shoulder - 6);
  const startY = layout.shoulderY + 14;
  const hand = arm.raised
    ? { x: startX + direction * 32, y: startY - 12 }
    : { x: startX + direction * 16, y: startY + arm.length };
  const elbow = arm.raised
    ? { x: startX + direction * 46, y: startY + 58 }
    : { x: startX + direction * 20, y: startY + arm.length * 0.5 };
  const path = `M${startX} ${startY}Q${elbow.x} ${elbow.y} ${hand.x} ${hand.y}`;
  const width = arm.width;

  return {
    hand,
    art: [
      `<path d="${path}" fill="none" stroke="${INK}" stroke-width="${width + OUTLINE * 2}" stroke-linecap="round"/>`,
      `<path d="${path}" fill="none" stroke="${arm.color}" stroke-width="${width}" stroke-linecap="round"/>`,
      arm.cuff ? `<path d="${path}" fill="none" stroke="${arm.cuff}" stroke-width="${width}" stroke-linecap="butt" stroke-dasharray="0 ${arm.cuffOffset ?? 72} 14 400"/>` : "",
      `<circle cx="${hand.x}" cy="${hand.y}" r="${arm.handSize ?? 11}" fill="${SKIN}" ${line}/>`,
    ].join(""),
  };
}

/* Head */

function drawNose(size, y) {
  if (size === "large") {
    return [
      `<ellipse cx="${CENTER + 3}" cy="${y + 8}" rx="20" ry="16" fill="${SKIN}"/>`,
      flat(`M${CENTER + 8} ${y + 21}Q${CENTER + 22} ${y + 18} ${CENTER + 22} ${y + 6}Q${CENTER + 24} ${y + 16} ${CENTER + 8} ${y + 21}Z`, SKIN_SHADE),
      stroke(`M${CENTER - 14} ${y + 5}Q${CENTER - 21} ${y + 18} ${CENTER - 3} ${y + 23}Q${CENTER + 26} ${y + 27} ${CENTER + 23} ${y + 6}`, INK, 4),
    ].join("");
  }
  return stroke(`M${CENTER - 1} ${y + 1}q8 5 0 10`, INK, 3.5);
}

function drawEye(x, y, eyes) {
  const lid = eyes.relaxed
    ? `<path d="M${x - 12.5} ${y - 4}Q${x} ${y - 16} ${x + 12.5} ${y - 4}Z" fill="${SKIN}"/>`
    : "";
  const lashY = eyes.relaxed ? y - 4 : y - 7;
  const lash = eyes.relaxed
    ? `M${x - 12.5} ${lashY}H${x + 12.5}`
    : `M${x - 12} ${lashY + 4}Q${x} ${lashY - 7} ${x + 12} ${lashY + 4}`;

  return [
    `<ellipse cx="${x}" cy="${y}" rx="11.5" ry="12" fill="#FFFDF7"/>`,
    `<circle cx="${x + 1}" cy="${y + 1}" r="8" fill="${eyes.iris}"/>`,
    `<circle cx="${x + 1}" cy="${y + 1}" r="4.2" fill="${INK}"/>`,
    `<circle cx="${x + 4}" cy="${y - 2.4}" r="2.2" fill="#FFFDF7"/>`,
    lid,
    stroke(lash, INK, 4),
  ].join("");
}

function drawBrow(x, y, color, side, { gap = false }) {
  const direction = side === "left" ? -1 : 1;
  const start = x - direction * 12;
  const end = x + direction * 13;
  if (!gap) {
    return stroke(`M${start} ${y + 1}Q${x} ${y - 7} ${end} ${y + 1}`, color, 6);
  }
  return [
    stroke(`M${start} ${y + 1}L${x + direction * 1} ${y - 4}`, color, 6),
    stroke(`M${x + direction * 8} ${y - 3}L${end} ${y + 1}`, color, 6),
  ].join("");
}

function drawGlasses(y, color) {
  const lens = (x) => `<circle cx="${x}" cy="${y}" r="15.5" fill="#FFFFFF" fill-opacity="0.16" stroke="${color}" stroke-width="4.5"/>`;
  return [
    lens(CENTER - 22),
    lens(CENTER + 22),
    stroke(`M${CENTER - 7} ${y - 2}q7 -5 14 0`, color, 4.5),
  ].join("");
}

function drawHead(layout, character) {
  const { x, y } = layout.head;
  const left = x - HEAD.width / 2;
  const top = y - HEAD.height / 2;
  const eyeY = y + 4;
  const eyeX = 22;
  const { face } = character;

  const mouthY = face.nose === "large" ? y + 36 : y + 28;
  const mouth = face.mouth === "smirk"
    ? stroke(`M${x - 13} ${mouthY + 5}q15 9 28 -4`, INK, 4)
    : `<path d="M${x - 15} ${mouthY}q15 ${face.nose === "large" ? 14 : 20} 30 0q-15 5 -30 0z" fill="#8C2B45" ${thin}/>`;

  return [
    `<circle cx="${left + 1}" cy="${eyeY + 8}" r="10" fill="${SKIN}" ${line}/>`,
    `<circle cx="${left + HEAD.width - 1}" cy="${eyeY + 8}" r="10" fill="${SKIN}" ${line}/>`,
    shape(roundedBox(left, top, HEAD.width, HEAD.height, 42), SKIN),
    flat(`M${x + 38} ${top + 12}Q${x + 50} ${y} ${x + 44} ${y + 30}Q${x + 34} ${y + 48} ${x + 12} ${y + 51}Q${x + 40} ${y + 26} ${x + 38} ${top + 12}Z`, SKIN_SHADE, 0.7),
    `<ellipse cx="${x - 33}" cy="${y + 22}" rx="9" ry="5.5" fill="#FF8FA3" opacity="0.5"/>`,
    `<ellipse cx="${x + 33}" cy="${y + 22}" rx="9" ry="5.5" fill="#FF8FA3" opacity="0.5"/>`,
    drawEye(x - eyeX, eyeY, face.eyes),
    drawEye(x + eyeX, eyeY, face.eyes),
    drawBrow(x - eyeX, eyeY - 17, face.brow, "left", { gap: face.browCut === "left" }),
    drawBrow(x + eyeX, eyeY - 17, face.brow, "right", { gap: face.browCut === "right" }),
    drawNose(face.nose, face.nose === "large" ? y + 13 : y + 16),
    mouth,
    face.glasses ? drawGlasses(eyeY, face.glasses) : "",
    face.browRing
      ? `<circle cx="${x + eyeX + 12}" cy="${eyeY - 14}" r="4.2" fill="none" stroke="${INK}" stroke-width="5.5"/><circle cx="${x + eyeX + 12}" cy="${eyeY - 14}" r="4.2" fill="none" stroke="${face.browRing}" stroke-width="3"/>`
      : "",
  ].join("");
}

/* Hair: each style is drawn around the same head box. */

const HAIR = {
  crop(x, top, colors) {
    return {
      back: "",
      front: [
        shape(`M${x - 53} ${top + 44}Q${x - 58} ${top - 8} ${x} ${top - 8}Q${x + 58} ${top - 8} ${x + 53} ${top + 44}Q${x + 46} ${top + 24} ${x + 28} ${top + 22}Q${x} ${top + 28} ${x - 28} ${top + 22}Q${x - 46} ${top + 24} ${x - 53} ${top + 44}Z`, colors.base),
        flat(`M${x - 34} ${top + 4}Q${x - 6} ${top - 6} ${x + 18} ${top + 4}Q${x - 6} ${top + 3} ${x - 34} ${top + 12}Z`, colors.light, 0.8),
      ].join(""),
    };
  },
  sweep(x, top, colors) {
    return {
      back: "",
      front: [
        shape(`M${x - 54} ${top + 46}Q${x - 62} ${top + 4} ${x - 26} ${top - 12}Q${x + 22} ${top - 26} ${x + 50} ${top - 6}Q${x + 62} ${top + 10} ${x + 54} ${top + 44}Q${x + 48} ${top + 22} ${x + 34} ${top + 20}Q${x - 4} ${top + 38} ${x - 30} ${top + 20}Q${x - 48} ${top + 24} ${x - 54} ${top + 46}Z`, colors.base),
        flat(`M${x - 26} ${top + 2}Q${x + 8} ${top - 16} ${x + 40} ${top - 2}Q${x + 6} ${top - 6} ${x - 26} ${top + 12}Z`, colors.light, 0.85),
      ].join(""),
    };
  },
  fringe(x, top, colors) {
    return {
      back: "",
      front: [
        shape(`M${x - 54} ${top + 40}Q${x - 58} ${top - 10} ${x + 4} ${top - 10}Q${x + 60} ${top - 8} ${x + 54} ${top + 40}Q${x + 44} ${top + 28} ${x + 36} ${top + 16}Q${x + 22} ${top + 30} ${x + 6} ${top + 18}Q${x - 10} ${top + 32} ${x - 22} ${top + 18}Q${x - 38} ${top + 30} ${x - 54} ${top + 40}Z`, colors.base),
        flat(`M${x - 30} ${top + 2}Q${x} ${top - 8} ${x + 28} ${top + 2}Q${x} ${top} ${x - 30} ${top + 10}Z`, colors.light, 0.8),
      ].join(""),
    };
  },
  tousled(x, top, colors) {
    return {
      back: "",
      front: [
        shape(`M${x - 54} ${top + 42}Q${x - 66} ${top + 14} ${x - 46} ${top + 2}Q${x - 44} ${top - 16} ${x - 20} ${top - 12}Q${x} ${top - 26} ${x + 20} ${top - 12}Q${x + 44} ${top - 16} ${x + 46} ${top + 2}Q${x + 66} ${top + 14} ${x + 54} ${top + 42}Q${x + 46} ${top + 22} ${x + 24} ${top + 24}Q${x + 6} ${top + 14} ${x - 10} ${top + 26}Q${x - 36} ${top + 16} ${x - 54} ${top + 42}Z`, colors.base),
        flat(`M${x - 28} ${top - 2}Q${x - 10} ${top - 14} ${x + 12} ${top - 6}Q${x - 8} ${top - 6} ${x - 28} ${top + 8}Z`, colors.light, 0.85),
      ].join(""),
    };
  },
  bob(x, top, colors) {
    return {
      back: shape(`M${x - 62} ${top + 104}Q${x - 74} ${top + 20} ${x - 40} ${top - 4}Q${x} ${top - 20} ${x + 40} ${top - 4}Q${x + 74} ${top + 20} ${x + 62} ${top + 104}Q${x + 40} ${top + 114} ${x + 30} ${top + 96}H${x - 30}Q${x - 40} ${top + 114} ${x - 62} ${top + 104}Z`, colors.base),
      front: [
        shape(`M${x - 56} ${top + 60}Q${x - 62} ${top - 12} ${x} ${top - 12}Q${x + 62} ${top - 12} ${x + 56} ${top + 60}Q${x + 50} ${top + 24} ${x + 26} ${top + 12}Q${x - 18} ${top + 34} ${x - 40} ${top + 22}Q${x - 50} ${top + 32} ${x - 56} ${top + 60}Z`, colors.base),
        flat(`M${x - 32} ${top + 2}Q${x} ${top - 10} ${x + 28} ${top}Q${x} ${top - 1} ${x - 32} ${top + 12}Z`, colors.light, 0.8),
      ].join(""),
    };
  },
  long(x, top, colors) {
    return {
      back: shape(`M${x - 60} ${top + 150}Q${x - 78} ${top + 30} ${x - 42} ${top - 2}Q${x} ${top - 20} ${x + 42} ${top - 2}Q${x + 78} ${top + 30} ${x + 60} ${top + 150}Q${x + 42} ${top + 164} ${x + 26} ${top + 148}H${x - 26}Q${x - 42} ${top + 164} ${x - 60} ${top + 150}Z`, colors.base),
      front: [
        shape(`M${x - 56} ${top + 66}Q${x - 62} ${top - 12} ${x} ${top - 12}Q${x + 62} ${top - 12} ${x + 56} ${top + 66}Q${x + 52} ${top + 30} ${x + 8} ${top + 8}Q${x - 2} ${top + 4} ${x - 8} ${top + 10}Q${x - 44} ${top + 26} ${x - 56} ${top + 66}Z`, colors.base),
        flat(`M${x - 36} ${top + 8}Q${x - 12} ${top - 8} ${x - 2} ${top - 6}Q${x - 16} ${top + 2} ${x - 40} ${top + 20}Z`, colors.light, 0.85),
        flat(`M${x + 12} ${top - 6}Q${x + 34} ${top - 4} ${x + 42} ${top + 12}Q${x + 28} ${top + 2} ${x + 12} ${top - 6}Z`, colors.light, 0.85),
      ].join(""),
    };
  },
  waves(x, top, colors) {
    return {
      back: "",
      front: [
        shape(`M${x - 54} ${top + 42}Q${x - 70} ${top + 22} ${x - 52} ${top + 6}Q${x - 58} ${top - 14} ${x - 30} ${top - 12}Q${x - 18} ${top - 26} ${x + 2} ${top - 16}Q${x + 22} ${top - 26} ${x + 34} ${top - 10}Q${x + 60} ${top - 12} ${x + 52} ${top + 8}Q${x + 70} ${top + 22} ${x + 54} ${top + 42}Q${x + 46} ${top + 24} ${x + 30} ${top + 24}Q${x + 14} ${top + 12} ${x} ${top + 24}Q${x - 14} ${top + 12} ${x - 30} ${top + 24}Q${x - 46} ${top + 24} ${x - 54} ${top + 42}Z`, colors.base),
        flat(`M${x - 34} ${top - 2}Q${x - 18} ${top - 14} ${x + 2} ${top - 6}Q${x + 16} ${top - 14} ${x + 30} ${top - 2}Q${x + 6} ${top - 4} ${x} ${top}Q${x - 18} ${top - 4} ${x - 34} ${top + 6}Z`, colors.light, 0.85),
      ].join(""),
    };
  },
};

/* Accessories, drawn around the hand that holds them. */

const ACCESSORIES = {
  dumbbell({ x, y }) {
    const bar = `<rect x="${x - 32}" y="${y - 5}" width="64" height="10" rx="4" fill="#C9CFDA" ${thin}/>`;
    const plate = (px, height) =>
      `<rect x="${px}" y="${y - height / 2}" width="13" height="${height}" rx="4.5" fill="#39305A" ${line}/>`;
    return [bar, plate(x - 44, 42), plate(x - 33, 30), plate(x + 20, 30), plate(x + 31, 42)].join("");
  },
  beer({ x, y }) {
    const left = x - 19;
    const top = y - 50;
    return [
      `<path d="M${left + 38} ${top + 20}h9q9 0 9 9v15q0 9 -9 9h-9" fill="none" stroke="${INK}" stroke-width="10"/>`,
      `<path d="M${left + 38} ${top + 20}h9q9 0 9 9v15q0 9 -9 9h-9" fill="none" stroke="#FFF6D9" stroke-width="3.5"/>`,
      shape(`M${left} ${top + 8}h40l-3 62q0 6 -6 6h-22q-6 0 -6 -6z`, "#FFB931"),
      flat(`M${left + 26} ${top + 14}h12l-3 58q0 3 -3 3h-6z`, "#F08A1D", 0.75),
      shape(`M${left - 4} ${top + 12}q-4 -14 10 -13q6 -11 18 -4q14 -6 16 8q6 8 -2 12q-6 4 -12 -1q-8 6 -14 0q-10 6 -16 -2z`, "#FFF9ED"),
    ].join("");
  },
  ball({ x, y }) {
    const cx = x;
    const cy = y - 24;
    const radius = 30;
    return [
      `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="#FFFFFF" ${line}/>`,
      `<path d="M${cx} ${cy - 11}l10.5 7.6l-4 12.4h-13l-4 -12.4z" fill="${INK}"/>`,
      stroke(`M${cx} ${cy - 11}V${cy - radius + 1}M${cx + 10.5} ${cy - 3.4}L${cx + radius - 3} ${cy - 10}M${cx + 6.5} ${cy + 9}L${cx + 17} ${cy + 24}M${cx - 6.5} ${cy + 9}L${cx - 17} ${cy + 24}M${cx - 10.5} ${cy - 3.4}L${cx - radius + 3} ${cy - 10}`, INK, 3),
    ].join("");
  },
  burger({ x, y }) {
    const left = x - 38;
    const top = y - 58;
    return [
      shape(`M${left} ${top + 34}q0 -32 38 -32t38 32z`, "#F0A63C"),
      flat(`M${left + 44} ${top + 6}q26 4 30 26h-18q-2 -16 -12 -26z`, "#D07F22", 0.7),
      `<ellipse cx="${left + 24}" cy="${top + 15}" rx="4" ry="2.4" fill="#FFF3C9"/><ellipse cx="${left + 40}" cy="${top + 10}" rx="4" ry="2.4" fill="#FFF3C9"/><ellipse cx="${left + 52}" cy="${top + 19}" rx="4" ry="2.4" fill="#FFF3C9"/>`,
      shape(`M${left - 4} ${top + 38}q8 -8 16 0t16 0t16 0t16 0t16 0t8 0v4h-88z`, "#55C271"),
      shape(`M${left - 2} ${top + 42}h80l-10 8l-10 -6h-60z`, "#FFD12F"),
      shape(roundedBox(left, top + 44, 76, 14, 7), "#6B3A23"),
      shape(`M${left} ${top + 58}h76q0 16 -14 16h-48q-14 0 -14 -16z`, "#F0A63C"),
    ].join("");
  },
};

/* Outfits paint on top of the torso; everything inside clips to its shape. */

function drawOutfit(layout, outfit) {
  const torso = torsoPath(layout, outfit);
  const { shoulderY, hipY, shoulder, hip } = layout;
  const top = shoulderY;
  const bottom = hipY + (outfit.hem ?? 0);
  const height = bottom - top;
  const details = outfit.draw?.({ top, bottom, height, shoulder, hip, center: CENTER }) ?? "";

  return [
    `<clipPath id="torso"><path d="${torso}"/></clipPath>`,
    shape(torso, outfit.color),
    `<g clip-path="url(#torso)">`,
    details,
    flat(`M${CENTER + shoulder * 0.46} ${top - 4}H${CENTER + shoulder + 6}V${bottom + 10}H${CENTER + hip * 0.3}Z`, outfit.shade, 0.32),
    `</g>`,
    `<path d="${torso}" fill="none" ${line}/>`,
  ].join("");
}

export function drawCharacter(character) {
  const layout = getLayout(character);
  const { x, y } = layout.head;
  const top = y - HEAD.height / 2;
  const hair = HAIR[character.hair.style](x, top, character.hair);
  const armColor = character.arms;

  const armLeft = drawArm(layout, "left", { raised: false, ...armColor, length: armColor.length ?? 104 });
  const armRight = drawArm(layout, "right", {
    raised: Boolean(character.accessory),
    ...armColor,
    length: armColor.length ?? 104,
  });
  const accessory = character.accessory ? ACCESSORIES[character.accessory](armRight.hand) : "";

  return [
    hair.back,
    drawLegs(layout, character),
    armLeft.art,
    drawOutfit(layout, character.outfit),
    `<path d="M${CENTER - 15} ${layout.shoulderY - 8}h30v16q-15 12 -30 0z" fill="${SKIN_SHADE}" ${line}/>`,
    character.outfit.collar?.({ y: layout.shoulderY, center: CENTER }) ?? "",
    armRight.art,
    accessory,
    drawHead(layout, character),
    hair.front,
  ].join("");
}

/** Bust crop around the head and the raised accessory, on the same art. */
export function getPortraitBox(character) {
  const { head } = getLayout(character);
  const size = character.accessory ? 186 : 164;
  const shift = character.accessory ? 18 : 0;
  return { x: head.x - size / 2 + shift, y: head.y - (character.accessory ? 80 : 74), width: size, height: size };
}

export function wrapSvg(body, title, box = { x: 0, y: 0, ...CANVAS }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.x} ${box.y} ${box.width} ${box.height}" role="img" aria-label="${title}">${body}</svg>\n`;
}

export { CENTER, flat, roundedBox, stroke };
