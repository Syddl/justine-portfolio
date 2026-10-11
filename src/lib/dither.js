// The pixel dissolve shared by the first-load cover and the theme switch.
//
// Every canvas pixel gets a threshold: mostly how far down the screen its
// row is, plus some noise, so the edge sweeping down the page is dithered
// instead of a straight line. As the eased progress (ditherCut) passes a
// pixel's threshold, that pixel turns over: on load the cover pixel goes
// clear; on a theme switch the new theme shows through it.
//
// ditherThresholds and ditherCut are self-contained on purpose (no imports,
// no outside helpers): introScript inlines their source text into the page,
// so each must work on its own, minified or not.

export const DITHER_PX = 3; // one canvas pixel per 3x3 screen pixels
export const INTRO_MS = 900;
export const THEME_MS = 800;

export const ditherThresholds = (cols, rows, random = Math.random) => {
  const thresholds = new Float32Array(cols * rows);
  for (let i = 0; i < thresholds.length; i++) {
    thresholds[i] = (Math.floor(i / cols) / rows) * 0.72 + random() * 0.28;
  }
  return thresholds;
};

// Ease-in-out progress, scaled to 1.02 so even the highest threshold (just
// under 1) has been passed when the animation ends.
export const ditherCut = (progress) => {
  const x = Math.min(1, Math.max(0, progress));
  return 1.02 * (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
};

// The first-load cover. layout.js renders <canvas class="dither-cover">
// with this script straight after it, so it runs while the HTML is still
// parsing, before first paint and before React loads. It paints the canvas
// in the page background, then clears it pixel by pixel, top first.
// Reduced motion: hidden at once. If anything goes wrong, the CSS failsafe
// on .dither-cover (globals.css) hides it after 2s. No imports or outside references: it is
// inlined as text, not bundled.
function runIntro(thresholds, cut, px, ms) {
  var canvas = document.currentScript.previousElementSibling;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    canvas.style.display = "none";
    return;
  }
  var w = Math.ceil(innerWidth / px);
  var h = Math.ceil(innerHeight / px);
  canvas.width = w;
  canvas.height = h;
  var rgb = (
    getComputedStyle(document.body).backgroundColor.match(/\d+/g) || [15, 15, 17]
  ).map(Number);
  var ctx = canvas.getContext("2d");
  var image = ctx.createImageData(w, h);
  var data = image.data;
  var th = thresholds(w, h);
  for (var i = 0; i < th.length; i++) {
    data[4 * i] = rgb[0];
    data[4 * i + 1] = rgb[1];
    data[4 * i + 2] = rgb[2];
    data[4 * i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  var start;
  var frame = function (now) {
    if (start === undefined) start = now;
    var progress = (now - start) / ms;
    var line = cut(progress);
    for (var j = 0; j < th.length; j++) data[4 * j + 3] = th[j] < line ? 0 : 255;
    ctx.putImageData(image, 0, 0);
    if (progress < 1) requestAnimationFrame(frame);
    else canvas.style.display = "none";
  };
  requestAnimationFrame(frame);
}

export const introScript = `(${runIntro})(${ditherThresholds}, ${ditherCut}, ${DITHER_PX}, ${INTRO_MS})`;
