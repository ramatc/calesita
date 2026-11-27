/** Uniform integer in [0, max). Rejection sampling keeps every outcome equally likely. */
export function drawIndex(
  max: number,
  getRandomValues: (array: Uint32Array) => Uint32Array = (array) =>
    globalThis.crypto.getRandomValues(array),
): number {
  if (!Number.isInteger(max) || max <= 0) throw new RangeError("max must be a positive integer");
  const range = 2 ** 32;
  const limit = range - (range % max);
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    value = getRandomValues(buffer)[0];
  } while (value >= limit);
  return value % max;
}

const FULL_TURN = 360;

export function getSegmentAngle(count: number): number {
  return FULL_TURN / count;
}

function normalize(angle: number): number {
  return ((angle % FULL_TURN) + FULL_TURN) % FULL_TURN;
}

/**
 * The segment under the pointer, which sits at the top of the wheel.
 * Segment 0 starts at the top and segments run clockwise; the wheel turns clockwise.
 */
export function getIndexAtPointer(rotation: number, count: number): number {
  const angleUnderPointer = normalize(-rotation);
  return Math.min(count - 1, Math.floor(angleUnderPointer / getSegmentAngle(count)));
}

/**
 * The final rotation that lands the pointer inside the drawn segment. The winner is drawn
 * first; the offset inside the segment is cosmetic and never reaches its edges.
 */
export function planSpin(
  currentRotation: number,
  winner: number,
  count: number,
  offset: number = Math.random(),
  turns = 5,
): number {
  const segment = getSegmentAngle(count);
  const angleInWheel = (winner + 0.15 + 0.7 * offset) * segment;
  const targetMod = normalize(-angleInWheel);
  const delta = normalize(targetMod - normalize(currentRotation));
  return currentRotation + turns * FULL_TURN + delta;
}
