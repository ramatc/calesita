/**
 * Writes the character art to public/characters. Run with `pnpm characters:build`.
 * The joint sheet comes from the same rig, so it is the place to judge consistency.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { CAST } from "./cast.mjs";
import { CANVAS, drawCharacter, getPortraitBox, wrapSvg } from "./rig.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "characters");

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function buildSheet() {
  const slot = CANVAS.width - 30;
  const width = slot * CAST.length + 60;
  const figures = CAST.map((character, index) =>
    `<g transform="translate(${index * slot + 15} 10)">${drawCharacter(character).replaceAll('"torso"', `"torso-${character.id}"`).replaceAll("#torso", `#torso-${character.id}`)}</g>`,
  ).join("");

  return wrapSvg(figures, "Calesita character sheet", {
    x: 0,
    y: 0,
    width,
    height: CANVAS.height + 20,
  });
}

for (const character of CAST) {
  const art = drawCharacter(character);
  write(join(root, character.id, "full.svg"), wrapSvg(art, character.name));
  write(join(root, character.id, "portrait.svg"), wrapSvg(art, character.name, getPortraitBox(character)));
}

write(join(root, "sheet.svg"), buildSheet());
console.log(`Wrote ${CAST.length} characters to ${root}`);
