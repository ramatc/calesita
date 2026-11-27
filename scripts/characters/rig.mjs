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

function drawBall(cx, cy, radius) {
  const patch = (angle) =>
    `<path d="M${cx} ${cy - radius + 1}l6 4l-2 6h-8l-2 -6z" fill="${INK}" transform="rotate(${angle} ${cx} ${cy})"/>`;
  return [
    `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="#FFFFFF" ${line}/>`,
    [20, 140, 260].map(patch).join(""),
    `<path d="M${cx - 6} ${cy - 3}l6 -4l6 4l-2 7h-8z" fill="${INK}"/>`,
  ].join("");
}

function drawLegs({ hipY, hip }, { legs }) {
  const ground = CANVAS.ground;
  const gap = 5;
  const width = legs.width;
  const knee = legs.hem ?? ground - 12;
  const left = `M${CENTER - hip + 1} ${hipY - 6}L${CENTER - hip - legs.flare} ${knee}H${CENTER - hip - legs.flare + width}L${CENTER - gap} ${hipY + 20}L${CENTER - gap} ${hipY - 6}Z`;
  const right = `M${CENTER + hip - 1} ${hipY - 6}L${CENTER + hip + legs.flare} ${knee}H${CENTER + hip + legs.flare - width}L${CENTER + gap} ${hipY + 20}L${CENTER + gap} ${hipY - 6}Z`;
  const legLeft = CENTER - hip + 2;
  const legRight = CENTER + hip - 2 - width + 8;

  // A stepping leg plants its foot on top of a ball, out to the side.
  const ballRadius = 22;
  const leftFootX = legLeft + (width - 8) / 2 - 2 - (legs.step ? 20 : 0);
  const leftFootY = legs.step ? ground - ballRadius * 2 + 2 : ground;

  let skin = "";
  if (legs.hem) {
    const calfWidth = width - 8;
    const sock = legs.sock;
    const leftCalf = legs.step
      ? `M${legLeft} ${knee - 4}h${calfWidth}L${leftFootX + calfWidth / 2 + 2} ${leftFootY - 2}h-${calfWidth}z`
      : `M${legLeft} ${knee - 4}h${calfWidth}v${ground - knee - 2}h-${calfWidth}z`;
    skin = [
      shape(leftCalf, sock ?? SKIN),
      shape(`M${legRight} ${knee - 4}h${calfWidth}v${ground - knee - 2}h-${calfWidth}z`, sock ?? SKIN),
    ].join("");
  }

  const shoe = (x, direction, base = ground) => {
    const heel = x - direction * 13;
    const toe = direction * 30;
    return shape(
      `M${heel} ${base}v-13q0 -7 ${direction * 7} -7h${direction * 12}q${toe * 0.62} 3 ${toe - direction * 2} 14q${direction * 2} 3 0 6z`,
      legs.shoe,
    );
  };

  return [
    `<ellipse cx="${CENTER}" cy="${ground + 2}" rx="${hip + 34}" ry="7" fill="${INK}" opacity="0.28"/>`,
    skin,
    shape(left, legs.color),
    shape(right, legs.color),
    flat(`M${CENTER + gap + 2} ${hipY + 22}L${CENTER + hip + legs.flare - width + 8} ${knee - 2}H${CENTER + hip + legs.flare - 2}L${CENTER + hip - 4} ${hipY}Z`, legs.shade, 0.55),
    legs.step ? drawBall(leftFootX - 4, ground - ballRadius, ballRadius) : "",
    shoe(leftFootX, -1, leftFootY),
    shoe(legRight + (width - 8) / 2 + 2, 1),
  ].join("");
}

function torsoPath({ shoulderY, hipY, shoulder, hip }, { hem = 0 }) {
  const bottom = hipY + hem;
  return `M${CENTER - shoulder + 12} ${shoulderY}Q${CENTER - shoulder} ${shoulderY + 2} ${CENTER - shoulder} ${shoulderY + 18}L${CENTER - hip} ${bottom}Q${CENTER} ${bottom + 6} ${CENTER + hip} ${bottom}L${CENTER + shoulder} ${shoulderY + 18}Q${CENTER + shoulder} ${shoulderY + 2} ${CENTER + shoulder - 12} ${shoulderY}Z`;
}

/* Arm poses: where the elbow bends and the hand lands, from the shoulder. */
const ARM_POSES = {
  down: ({ startX, startY, direction, length }) => ({
    hand: { x: startX + direction * 16, y: startY + length },
    elbow: { x: startX + direction * 20, y: startY + length * 0.5 },
  }),
  hold: ({ startX, startY, direction }) => ({
    hand: { x: startX + direction * 32, y: startY - 12 },
    elbow: { x: startX + direction * 46, y: startY + 58 },
  }),
  wave: ({ startX, startY, direction }) => ({
    hand: { x: startX + direction * 40, y: startY - 92 },
    elbow: { x: startX + direction * 62, y: startY - 14 },
  }),
  hip: ({ startY, direction, layout }) => ({
    hand: { x: CENTER + direction * (layout.hip + 4), y: layout.hipY - 14 },
    elbow: { x: CENTER + direction * (layout.shoulder + 44), y: startY + 54 },
  }),
};

function drawArm(layout, side, arm) {
  const direction = side === "left" ? -1 : 1;
  const startX = CENTER + direction * (layout.shoulder - 6);
  const startY = layout.shoulderY + 14;
  const pose = ARM_POSES[arm.pose ?? "down"]({ startX, startY, direction, layout, length: arm.length });
  const { hand, elbow } = pose;
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

/* A short, full beard that follows the jaw, with the mustache over the mouth. */
function drawBeard(x, y, mouthY, color) {
  return [
    flat(`M${x - 52} ${y + 4}Q${x - 52} ${y + 58} ${x} ${y + 60}Q${x + 52} ${y + 58} ${x + 52} ${y + 4}L${x + 45} ${y + 10}Q${x + 42} ${y + 30} ${x + 22} ${y + 34}Q${x} ${y + 26} ${x - 22} ${y + 34}Q${x - 42} ${y + 30} ${x - 45} ${y + 10}Z`, color, 0.9),
    `<path d="M${x - 52} ${y + 4}Q${x - 52} ${y + 58} ${x} ${y + 60}Q${x + 52} ${y + 58} ${x + 52} ${y + 4}" fill="none" ${line}/>`,
    flat(`M${x - 19} ${mouthY + 6}Q${x} ${mouthY - 4} ${x + 19} ${mouthY + 6}Q${x} ${mouthY + 2} ${x - 19} ${mouthY + 6}Z`, color),
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
    face.beard ? drawBeard(x, y, face.nose === "large" ? y + 36 : y + 28, face.beard) : "",
    drawEye(x - eyeX, eyeY, face.eyes),
    drawEye(x + eyeX, eyeY, face.eyes),
    drawBrow(x - eyeX, eyeY - 17, face.brow, "left", { gap: face.browCut === "left" }),
    drawBrow(x + eyeX, eyeY - 17, face.brow, "right", { gap: face.browCut === "right" }),
    drawNose(face.nose, face.nose === "large" ? y + 13 : y + 16),
    mouth,
    face.glasses ? drawGlasses(eyeY, face.glasses) : "",
    face.browBar
      ? `<circle cx="${x + eyeX + 6}" cy="${eyeY - 24}" r="3.6" fill="${face.browBar}" ${thin}/><circle cx="${x + eyeX + 13}" cy="${eyeY - 11}" r="3.6" fill="${face.browBar}" ${thin}/>`
      : face.browRing
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
  fade(x, top, colors) {
    return {
      back: "",
      front: [
        flat(`M${x - 53} ${top + 40}Q${x - 56} ${top + 6} ${x - 40} ${top - 2}H${x + 40}Q${x + 56} ${top + 6} ${x + 53} ${top + 40}Q${x + 50} ${top + 22} ${x + 44} ${top + 18}H${x - 44}Q${x - 50} ${top + 22} ${x - 53} ${top + 40}Z`, colors.light, 0.75),
        shape(`M${x - 44} ${top + 18}Q${x - 50} ${top - 14} ${x} ${top - 14}Q${x + 50} ${top - 14} ${x + 44} ${top + 18}Q${x + 22} ${top + 10} ${x} ${top + 14}Q${x - 22} ${top + 10} ${x - 44} ${top + 18}Z`, colors.base),
        flat(`M${x - 26} ${top - 4}Q${x} ${top - 12} ${x + 22} ${top - 4}Q${x} ${top - 6} ${x - 26} ${top + 4}Z`, colors.light, 0.8),
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
  clapper({ x, y }) {
    const left = x - 26;
    const top = y - 30;
    const stripes = (y0) =>
      [6, 20, 34].map((dx) => `<path d="M${left + dx} ${y0}h8l-6 8h-8z" fill="#FFFFFF"/>`).join("");
    const clap = `<animateTransform attributeName="transform" type="rotate" values="0 ${left} ${top};-22 ${left} ${top};0 ${left} ${top};0 ${left} ${top}" keyTimes="0;0.15;0.3;1" dur="2.2s" repeatCount="indefinite"/>`;
    return [
      shape(roundedBox(left, top + 2, 52, 30, 4), "#221C2E"),
      `<g>${stripes(top + 2)}</g>`,
      stroke(`M${left + 6} ${top + 18}h40M${left + 6} ${top + 25}h28`, "#C9C3DB", 2),
      `<g>${clap}`,
      shape(roundedBox(left, top - 8, 52, 9, 2), "#221C2E"),
      `<g transform="translate(0 -10)">${stripes(top)}</g>`,
      `</g>`,
    ].join("");
  },
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
  phone({ x, y }) {
    const left = x - 14;
    const top = y - 62;
    return [
      shape(roundedBox(left, top, 32, 58, 7), "#EAD3C2"),
      `<rect x="${left + 4}" y="${top + 4}" width="14" height="16" rx="5" fill="#CDB3A0"/>`,
      `<circle cx="${left + 9}" cy="${top + 9}" r="3" fill="${INK}"/><circle cx="${left + 9}" cy="${top + 16}" r="3" fill="${INK}"/>`,
    ].join("");
  },
  cigarette({ x, y }) {
    const tip = x + 34;
    const top = y - 6;
    return [
      shape(`M${x - 4} ${top}h${tip - x + 4}v8h-${tip - x + 4}z`, "#FFFDF7"),
      shape(`M${x - 4} ${top}h11v8h-11z`, "#E89B4A"),
      flat(`M${tip - 5} ${top + 1.5}h5v5h-5z`, "#FF5A36"),
      stroke(`M${tip + 2} ${top - 4}q-8 -10 2 -18q10 -8 0 -18q-6 -7 2 -14`, "#C9C3DB", 4),
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

/* Companions sit on a shoulder and loop a small idle animation (SMIL, so it plays inside <img>). */

const spline = `calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"`;
const hover = (lift, dur) =>
  `<animateTransform attributeName="transform" type="translate" values="0 0;0 -${lift};0 0" dur="${dur}s" repeatCount="indefinite" ${spline}/>`;
const sway = (degrees, cx, cy, dur) =>
  `<animateTransform attributeName="transform" type="rotate" values="-${degrees} ${cx} ${cy};${degrees} ${cx} ${cy};-${degrees} ${cx} ${cy}" dur="${dur}s" repeatCount="indefinite" ${spline}/>`;

/** A scalloped circle that reads as curly fur. */
function fluff(cx, cy, radius, lobes) {
  const points = Array.from({ length: lobes }, (_, index) => {
    const angle = (Math.PI * 2 * index) / lobes - Math.PI / 2;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  });
  const bump = (radius * Math.PI) / lobes;
  const arcs = points.map((_, index) => {
    const [px, py] = points[(index + 1) % lobes];
    return `A${bump.toFixed(1)} ${bump.toFixed(1)} 0 0 1 ${px.toFixed(1)} ${py.toFixed(1)}`;
  });
  return `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}${arcs.join("")}Z`;
}

/** Round blinking eyes plus an open smile, shared by the cartoon companions. */
function buddyFace(cx, cy, gap = 8) {
  const blink = `<animate attributeName="ry" values="3.6;3.6;0.5;3.6" keyTimes="0;0.9;0.95;1" dur="3.2s" repeatCount="indefinite"/>`;
  const eye = (ex) => `<ellipse cx="${ex}" cy="${cy}" rx="3" ry="3.6" fill="${INK}">${blink}</ellipse>`;
  return [
    eye(cx - gap),
    eye(cx + gap),
    `<circle cx="${cx - gap - 6}" cy="${cy + 6}" r="2.6" fill="#FF8FA3" opacity="0.8"/><circle cx="${cx + gap + 6}" cy="${cy + 6}" r="2.6" fill="#FF8FA3" opacity="0.8"/>`,
    shape(`M${cx - 5} ${cy + 5}q5 7 10 0z`, "#E0524A"),
  ].join("");
}

const COMPANIONS = {
  burger({ x, y }) {
    const squash = `<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1;1.06 0.92;1 1" dur="1.6s" repeatCount="indefinite" ${spline}/>`;
    const left = x - 26;
    const top = y - 46;
    return [
      `<g>${hover(6, 1.6)}<g transform="translate(${x} ${y}) "><g>${squash}<g transform="translate(${-x} ${-y})">`,
      shape(`M${left} ${top + 22}q0 -22 26 -22t26 22z`, "#F0A63C"),
      `<ellipse cx="${left + 16}" cy="${top + 8}" rx="2.6" ry="1.6" fill="#FFF3C9"/><ellipse cx="${left + 34}" cy="${top + 7}" rx="2.6" ry="1.6" fill="#FFF3C9"/>`,
      shape(`M${left - 3} ${top + 25}q5 -6 10 0t10 0t10 0t10 0t10 0t11 0v3h-61z`, "#55C271"),
      shape(`M${left - 1} ${top + 28}h54l-7 6l-7 -4h-40z`, "#FFD12F"),
      shape(roundedBox(left, top + 30, 52, 10, 5), "#6B3A23"),
      shape(`M${left} ${top + 40}h52q0 10 -10 10h-32q-10 0 -10 -10z`, "#F0A63C"),
      buddyFace(x, top + 14, 9),
      `</g></g></g></g>`,
    ].join("");
  },
  ball({ x, y }) {
    const cx = x;
    const cy = y - 24;
    const radius = 22;
    const spin = `<animateTransform attributeName="transform" type="rotate" values="0 ${cx} ${cy};360 ${cx} ${cy}" dur="4s" repeatCount="indefinite"/>`;
    const bounce = `<animateTransform attributeName="transform" type="translate" values="0 0;0 -12;0 0" keyTimes="0;0.5;1" dur="0.9s" repeatCount="indefinite" calcMode="spline" keySplines="0.2 0.6 0.4 1;0.6 0 0.8 0.4"/>`;
    return [
      `<g>${bounce}`,
      `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="#FFFFFF" ${line}/>`,
      `<g>${spin}${[0, 120, 240].map((angle) => `<path d="M${cx} ${cy - radius + 1}l6 4l-2 6h-8l-2 -6z" fill="${INK}" transform="rotate(${angle} ${cx} ${cy})"/>`).join("")}</g>`,
      buddyFace(cx, cy - 2, 7),
      `</g>`,
    ].join("");
  },
  beer({ x, y }) {
    const left = x - 16;
    const top = y - 54;
    const bubble = (dx, delay) =>
      `<circle cx="${left + dx}" r="2.2" fill="#FFF6D9" opacity="0"><animate attributeName="cy" values="${top + 48};${top + 18}" dur="1.8s" begin="${delay}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0.9;0" dur="1.8s" begin="${delay}s" repeatCount="indefinite"/></circle>`;
    return [
      `<g>${hover(4, 2)}<g>${sway(6, x, y, 2.6)}`,
      `<path d="M${left + 32} ${top + 18}h7q8 0 8 8v12q0 8 -8 8h-7" fill="none" stroke="${INK}" stroke-width="9"/>`,
      `<path d="M${left + 32} ${top + 18}h7q8 0 8 8v12q0 8 -8 8h-7" fill="none" stroke="#FFF6D9" stroke-width="3"/>`,
      shape(`M${left} ${top + 8}h34l-2 44q0 5 -5 5h-20q-5 0 -5 -5z`, "#FFB931"),
      flat(`M${left + 22} ${top + 14}h10l-2 40q0 2 -2 2h-5z`, "#F08A1D", 0.7),
      bubble(8, 0), bubble(15, 0.7), bubble(11, 1.3),
      shape(`M${left - 4} ${top + 12}q-3 -12 9 -11q5 -9 15 -3q12 -5 14 7q5 7 -2 10q-5 3 -10 -1q-7 5 -12 0q-9 5 -14 -2z`, "#FFF9ED"),
      buddyFace(left + 17, top + 30, 7),
      `</g></g>`,
    ].join("");
  },
  poodle({ x, y }) {
    const fur = "#FBF8F3";
    const shade = "#E8DFD4";
    const wag = sway(18, x + 22, y - 14, 0.5);
    const tilt = sway(5, x - 4, y - 34, 2.8);
    const blink = `<animate attributeName="ry" values="3.4;3.4;0.5;3.4" keyTimes="0;0.9;0.95;1" dur="3.4s" repeatCount="indefinite"/>`;
    return [
      `<g>`,
      `<g>${wag}${shape(fluff(x + 28, y - 20, 9, 7), fur)}</g>`,
      shape(fluff(x + 4, y - 22, 22, 11), fur),
      shape(fluff(x - 8, y - 6, 8, 6), fur),
      shape(fluff(x + 12, y - 6, 8, 6), fur),
      `<g>${tilt}`,
      shape(fluff(x - 20, y - 36, 9, 7), shade),
      shape(fluff(x + 12, y - 36, 9, 7), shade),
      shape(fluff(x - 4, y - 42, 18, 10), fur),
      shape(fluff(x - 4, y - 58, 10, 7), fur),
      `<ellipse cx="${x - 10}" cy="${y - 42}" rx="2.8" ry="3.4" fill="${INK}">${blink}</ellipse>`,
      `<ellipse cx="${x + 2}" cy="${y - 42}" rx="2.8" ry="3.4" fill="${INK}">${blink}</ellipse>`,
      `<ellipse cx="${x - 4}" cy="${y - 35}" rx="3.6" ry="2.8" fill="${INK}"/>`,
      stroke(`M${x - 8} ${y - 31}q4 4 8 0`, INK, 2),
      `<circle cx="${x - 16}" cy="${y - 36}" r="2.6" fill="#FF8FA3" opacity="0.7"/><circle cx="${x + 8}" cy="${y - 36}" r="2.6" fill="#FF8FA3" opacity="0.7"/>`,
      `</g></g>`,
    ].join("");
  },
  shepherd({ x, y }) {
    const tan = "#C98A4B";
    const light = "#E9C089";
    const dark = "#2B2230";
    const wag = sway(16, x - 22, y - 14, 0.45);
    const tilt = sway(4, x + 4, y - 50, 3.2);
    const blink = `<animate attributeName="ry" values="3.2;3.2;0.5;3.2" keyTimes="0;0.9;0.95;1" dur="3.8s" repeatCount="indefinite"/>`;
    const pant = `<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1;1 1.25;1 1" dur="0.5s" repeatCount="indefinite"/>`;
    return [
      `<g>`,
      `<g>${wag}${shape(`M${x - 20} ${y - 10}q-22 -4 -24 -24q8 10 26 14z`, dark)}</g>`,
      shape(`M${x - 24} ${y}q-6 -34 14 -46q20 -8 30 10q6 14 2 36z`, tan),
      flat(`M${x - 22} ${y - 18}q-2 -22 14 -30q14 -4 20 4q-14 2 -20 14q-6 10 -14 12z`, dark, 0.92),
      shape(`M${x + 2} ${y - 30}q10 -6 18 4q2 14 -2 26h-14z`, light),
      shape(roundedBox(x - 2, y - 22, 10, 22, 5), tan),
      shape(roundedBox(x + 10, y - 22, 10, 22, 5), tan),
      `<g>${tilt}`,
      shape(`M${x - 12} ${y - 58}l-4 -26l16 16z`, dark),
      shape(`M${x + 18} ${y - 60}l8 -24l6 22z`, dark),
      flat(`M${x - 10} ${y - 64}l-2 -12l7 7z M${x + 22} ${y - 66}l4 -11l3 10z`, "#E8A8A0"),
      shape(`M${x - 14} ${y - 52}q-2 -20 20 -20q22 0 20 20q-2 16 -20 18q-18 -2 -20 -18z`, tan),
      flat(`M${x - 2} ${y - 70}q8 -4 16 0l-2 12q-6 -2 -12 0z`, dark, 0.85),
      shape(`M${x - 4} ${y - 48}q10 -6 20 0q2 10 -10 14q-12 -4 -10 -14z`, light),
      `<ellipse cx="${x - 3}" cy="${y - 56}" rx="2.8" ry="3.2" fill="${INK}">${blink}</ellipse>`,
      `<ellipse cx="${x + 15}" cy="${y - 56}" rx="2.8" ry="3.2" fill="${INK}">${blink}</ellipse>`,
      `<ellipse cx="${x + 6}" cy="${y - 46}" rx="4.4" ry="3.2" fill="${INK}"/>`,
      `<g transform="translate(${x + 6} ${y - 40})"><g>${pant}<path d="M-4 0q4 10 8 0z" fill="#E0524A" ${thin}/></g></g>`,
      stroke(`M${x} ${y - 41}q6 4 12 0`, INK, 2),
      `<path d="M${x - 10} ${y - 36}q16 8 32 0" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`,
      `<path d="M${x - 10} ${y - 36}q16 8 32 0" fill="none" stroke="#E5243B" stroke-width="3.5" stroke-linecap="round"/>`,
      `<circle cx="${x + 6}" cy="${y - 30}" r="5" fill="#FFD12F" ${thin}/>`,
      `<text x="${x + 6}" y="${y - 27.6}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="7" fill="${INK}">Z</text>`,
      `</g></g>`,
    ].join("");
  },
  guineaPig({ x, y }) {
    const fur = "#E9B46A";
    const blink = `<animate attributeName="ry" values="2.6;2.6;0.4;2.6" keyTimes="0;0.9;0.95;1" dur="3s" repeatCount="indefinite"/>`;
    const sniff = `<animateTransform attributeName="transform" type="scale" additive="sum" values="1 1;1.25 0.85;1 1;1 1" keyTimes="0;0.15;0.3;1" dur="1.4s" repeatCount="indefinite"/>`;
    const scoot = `<animateTransform attributeName="transform" type="translate" values="0 0;0 -2;0 0" dur="0.9s" repeatCount="indefinite"/>`;
    return [
      `<g>${scoot}`,
      shape(roundedBox(x - 14, y - 6, 8, 6, 3), "#F4C7A1"),
      shape(roundedBox(x + 6, y - 6, 8, 6, 3), "#F4C7A1"),
      shape(`M${x - 24} ${y - 12}q0 -18 22 -18q22 0 26 14q2 14 -22 14q-26 2 -26 -10z`, fur),
      flat(`M${x - 22} ${y - 16}q2 -12 14 -13q-2 10 -14 13z`, "#FBF8F3"),
      flat(`M${x - 6} ${y - 29}q12 -1 16 6q-8 4 -16 -6z`, "#7A4A2A", 0.9),
      shape(`M${x + 8} ${y - 28}q2 -6 7 -3q0 5 -5 6z`, "#E8A8A0"),
      `<ellipse cx="${x + 13}" cy="${y - 19}" rx="2.2" ry="2.6" fill="${INK}">${blink}</ellipse>`,
      `<g transform="translate(${x + 24} ${y - 15})"><g>${sniff}<ellipse cx="0" cy="0" rx="2.6" ry="2" fill="#E0524A"/></g></g>`,
      stroke(`M${x + 24} ${y - 13}l8 -2M${x + 24} ${y - 12}l8 2`, INK, 1.2),
      `<circle cx="${x + 16}" cy="${y - 13}" r="2.2" fill="#FF8FA3" opacity="0.7"/>`,
      `</g>`,
    ].join("");
  },
  bud({ x, y }) {
    const bob = `<animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="2.4s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>`;
    const wave = `<animateTransform attributeName="transform" type="rotate" values="-8 ${x - 26} ${y - 30};10 ${x - 26} ${y - 30};-8 ${x - 26} ${y - 30}" dur="1.2s" repeatCount="indefinite"/>`;
    const blink = `<animate attributeName="ry" values="2.2;2.2;0.4;2.2" keyTimes="0;0.9;0.95;1" dur="3.6s" repeatCount="indefinite"/>`;
    const puff = (dx, delay) =>
      `<circle cx="${x + dx}" cy="${y - 62}" r="5" fill="#FFFFFF" ${thin} opacity="0"><animate attributeName="cy" values="${y - 56};${y - 84}" dur="2.4s" begin="${delay}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="2.4s" begin="${delay}s" repeatCount="indefinite"/></circle>`;
    const leaf = (rotate) =>
      `<path d="M${x} ${y - 8}q-10 12 0 28q10 -14 0 -28z" fill="#4E8F3A" ${thin} transform="rotate(${rotate} ${x} ${y - 8})"/>`;
    const bumps = `M${x - 24} ${y - 8}q-8 -8 -2 -16q-6 -10 3 -16q-2 -10 8 -12q2 -10 11 -8q6 -8 12 0q9 -2 11 8q10 2 8 12q9 6 3 16q6 8 -2 16q-4 8 -14 7q-9 5 -18 0q-10 1 -14 -7z`;
    return [
      `<g>${bob}`,
      leaf(70), leaf(-70), leaf(30), leaf(-30),
      `<g>${wave}<path d="M${x - 22} ${y - 26}q-8 -6 -6 -16" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M${x - 22} ${y - 26}q-8 -6 -6 -16" fill="none" stroke="#B9D67A" stroke-width="4" stroke-linecap="round"/>`,
      `<path d="M${x - 28} ${y - 42}l-3 -9M${x - 28} ${y - 42}l3 -9" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${x - 28} ${y - 42}l-3 -9M${x - 28} ${y - 42}l3 -9" stroke="#B9D67A" stroke-width="2" stroke-linecap="round"/></g>`,
      shape(bumps, "#8DBE45"),
      flat(`M${x - 12} ${y - 48}q4 -6 10 -3q-6 2 -6 8z`, "#B9D67A", 0.9),
      `<ellipse cx="${x - 7}" cy="${y - 28}" rx="4" ry="2.2" fill="#FFFFFF" ${thin}>${blink}</ellipse>`,
      `<ellipse cx="${x + 8}" cy="${y - 28}" rx="4" ry="2.2" fill="#FFFFFF" ${thin}>${blink}</ellipse>`,
      stroke(`M${x - 12} ${y - 31}h9M${x + 3} ${y - 31}h9`, INK, 2.5),
      shape(`M${x - 6} ${y - 20}q7 9 14 0z`, "#E0524A"),
      puff(18, 0), puff(24, 1.2),
      `</g>`,
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

/** Companions sit on the left shoulder unless the cast puts them on the ground by the feet. */
function companionAnchor(character, layout) {
  if (character.companionSpot === "ground") return { x: CENTER - 84, y: CANVAS.ground };
  return { x: CENTER - Math.max(layout.shoulder + 10, 58), y: layout.shoulderY + 10 };
}

export function drawCharacter(character) {
  const layout = getLayout(character);
  const { x, y } = layout.head;
  const top = y - HEAD.height / 2;
  const hair = HAIR[character.hair.style](x, top, character.hair);
  const armColor = character.arms;

  const pose = { left: "down", right: character.accessory ? "hold" : "down", ...character.pose };
  const armLeft = drawArm(layout, "left", { ...armColor, pose: pose.left, length: armColor.length ?? 104 });
  const armRight = drawArm(layout, "right", { ...armColor, pose: pose.right, length: armColor.length ?? 104 });
  const accessory = character.accessory ? ACCESSORIES[character.accessory](armRight.hand) : "";
  const leftAccessory = character.leftAccessory
    ? ACCESSORIES[character.leftAccessory](armLeft.hand)
    : "";

  return [
    hair.back,
    drawLegs(layout, character),
    armLeft.art,
    drawOutfit(layout, character.outfit),
    `<path d="M${CENTER - 15} ${layout.shoulderY - 8}h30v16q-15 12 -30 0z" fill="${SKIN_SHADE}" ${line}/>`,
    character.outfit.collar?.({ y: layout.shoulderY, center: CENTER }) ?? "",
    armRight.art,
    accessory,
    leftAccessory,
    drawHead(layout, character),
    hair.front,
    character.companion ? COMPANIONS[character.companion](companionAnchor(character, layout)) : "",
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
