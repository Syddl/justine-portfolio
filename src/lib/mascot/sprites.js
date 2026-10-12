// Mini Justine, drawn as pixel maps: one character per pixel, "." empty.
// Spec: docs/superpowers/specs/2026-10-12-mascot-design.md. Pure (no DOM),
// so node --test covers it. The palette is character art with fixed colours;
// only the outline is themed, through --mascot-outline in globals.css.

// Every pose map is SIZE x SIZE; the drawn sprite is SIZE + 2 with the outline.
export const SIZE = 22;

export const PALETTE = {
  W: "#f4f4f2", // eye whites, envelope
  K: "#151517", // pupils, tee, shoes, sunglasses
  H: "#1e1b1a", // hair
  h: "#3d3634", // hair highlight
  S: "#e6b38c", // skin
  s: "#c48f6a", // mouth
  L: "#cfcfd3", // hoodie
  M: "#9a9aa1", // hood rim, laptop, envelope folds
  D: "#55555c", // trousers, laptop edge
  B: "#3b5bcc", // hoodie print
  G: "#3fbf73", // laptop logo, envelope seal
};

// The idle pose. The body is centred on column 9; the two spare columns on
// the right hold the raised arm when waving.
export const BASE = [
  "......HHHHHHH.........",
  "....HHHHHHHhHHH.......",
  "...HHHHHHHHHhHHH......",
  "..HHHHHHHHHHHHHHH.....",
  "..HHHHHHHHHHHHHHHH....",
  ".HHHHHHHHHHHHHHHHH....",
  ".HHHSHHHHSHHHHSHHH....",
  "..HSSSSSSSSSSSSSH.....",
  "..HSSSSSSSSSSSSSH.....",
  "..SSSWKWSSSWKWSSS.....",
  "..SSSWKWSSSWKWSSS.....",
  "..SSSSSSSSSSSSSSS.....",
  "...SSSSSSsSSSSSS......",
  "....SSSSSSSSSSS.......",
  "...MMMMKKKKKMMMM......",
  "..MLLLLKKKKKLLLLM.....",
  ".LLLLLLLLLLLLLLLLL....",
  ".LLLLBBBLLLBBBLLLL....",
  ".LLLLLLLLLLLLLLLLL....",
  ".SLLLLLLLLLLLLLLLS....",
  "...DDDDD...DDDDD......",
  "...KKKKK...KKKKK......",
];

// The eye pixels: rows 9-10, whites at columns 5, 7, 11 and 13, pupils at 6
// and 12. They are drawn as their own layers so the eyes can blink and the
// pupils can look left or right without redrawing the face.
export const EYE_ROWS = [9, 10];
export const EYE_WHITES = [5, 7, 11, 13];
export const PUPILS = [6, 12];

// A patch writes `text` at (row, col): "." clears a pixel, " " keeps it.
export const patch = (map, edits) => {
  const rows = map.map((row) => row.split(""));
  for (const [row, col, text] of edits) {
    [...text].forEach((ch, i) => {
      if (ch !== " ") rows[row][col + i] = ch;
    });
  }
  return rows.map((row) => row.join(""));
};

// Right arm raised (the viewer's right), hand beside the head.
const WAVE_A = [
  [8, 19, "SS"],
  [9, 19, "SS"],
  [10, 19, "L"],
  [11, 18, "LL"],
  [12, 18, "L"],
  [13, 17, "LL"],
  [14, 16, "LL"],
  [16, 17, "."],
  [17, 17, "."],
  [18, 17, "."],
  [19, 17, "."],
];
// The second wave frame tips the hand one pixel outward.
const WAVE_B = [
  [8, 19, ".SS"],
  [9, 19, ".SS"],
  [10, 19, "LL"],
];
// Two lenses joined by a bridge on the top row, a glint in each.
const SUNGLASSES = [
  [9, 4, "KKKKKKKKKKK"],
  [10, 4, "KKKK"],
  [10, 11, "KKKK"],
  [10, 8, "SSS"],
  [9, 5, "W"],
  [9, 12, "W"],
];
// A laptop held in front of the torso, its back to the viewer.
const LAPTOP = [
  [15, 3, "DDDDDDDDDDDDD"],
  [16, 3, "DMMMMMMMMMMMD"],
  [17, 3, "DMMMMMGMMMMMD"],
  [18, 3, "DMMMMMMMMMMMD"],
  [19, 2, "SDDDDDDDDDDDDDS"],
  [19, 1, "."],
  [19, 17, "."],
];
const ENVELOPE = [
  [15, 5, "WWWWWWWWW"],
  [16, 5, "WMWWWWWMW"],
  [17, 5, "WWMWWWMWW"],
  [18, 5, "WWWMGMWWW"],
  [19, 5, "WWWWWWWWW"],
  [17, 4, "S"],
  [17, 14, "S"],
  [19, 1, "."],
  [19, 17, "."],
];

export const POSES = {
  idle: BASE,
  waveA: patch(BASE, WAVE_A),
  waveB: patch(BASE, [...WAVE_A, ...WAVE_B]),
  sunglasses: patch(BASE, SUNGLASSES),
  typingA: patch(BASE, [...LAPTOP, [18, 2, "S"]]),
  typingB: patch(BASE, [...LAPTOP, [18, 16, "S"]]),
  envelope: patch(BASE, ENVELOPE),
};

// True when a pose shows the standard eyes (the sunglasses pose does not).
export const hasEyes = (map) =>
  EYE_ROWS.every(
    (r) => EYE_WHITES.every((c) => map[r][c] === "W") && PUPILS.every((c) => map[r][c] === "K"),
  );

// Pads the map by one pixel, then marks every empty pixel that touches a
// filled one (up, down, left or right) as outline "O".
export const withOutline = (map) => {
  const blank = ".".repeat(map[0].length + 2);
  const grid = [blank, ...map.map((row) => `.${row}.`), blank];
  const filled = (y, x) => {
    const ch = grid[y]?.[x];
    return ch !== undefined && ch !== ".";
  };
  return grid.map((row, y) =>
    [...row]
      .map((ch, x) => {
        if (ch !== ".") return ch;
        const touches = filled(y - 1, x) || filled(y + 1, x) || filled(y, x - 1) || filled(y, x + 1);
        return touches ? "O" : ".";
      })
      .join(""),
  );
};

// One SVG path for one colour: every horizontal run becomes a 1-high rect.
const runsPath = (rows, key) => {
  let d = "";
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== key) {
        x += 1;
        continue;
      }
      let end = x;
      while (row[end] === key) end += 1;
      d += `M${x} ${y}h${end - x}v1h-${end - x}z`;
      x = end;
    }
  });
  return d;
};

// Single pixels at map (row, col) positions, shifted by the outline padding.
const cellsPath = (rows, cols) =>
  rows.flatMap((r) => cols.map((c) => `M${c + 1} ${r + 1}h1v1h-1z`)).join("");

// What a pose is drawn from: one path per colour (key "O" is the outline)
// and, for poses with eyes, separate whites and pupils paths. The whites
// cover all six eye columns, so a pupil shifted aside leaves white behind;
// the face under the eyes is filled with skin, so a blink shows skin.
export const spriteLayers = (map) => {
  const eyes = hasEyes(map);
  const eyeCols = [...EYE_WHITES, ...PUPILS];
  const body = withOutline(map).map((row, y) =>
    [...row]
      .map((ch, x) => (eyes && EYE_ROWS.includes(y - 1) && eyeCols.includes(x - 1) ? "S" : ch))
      .join(""),
  );
  const paths = [...Object.keys(PALETTE), "O"]
    .map((key) => ({ key, d: runsPath(body, key) }))
    .filter((layer) => layer.d);
  return {
    size: SIZE + 2,
    paths,
    whites: eyes ? cellsPath(EYE_ROWS, eyeCols) : "",
    pupils: eyes ? cellsPath(EYE_ROWS, PUPILS) : "",
  };
};

// Every pose's layers, computed once at import.
export const POSE_LAYERS = Object.fromEntries(
  Object.entries(POSES).map(([name, map]) => [name, spriteLayers(map)]),
);
