import { PALETTE, POSE_LAYERS } from "@/lib/mascot/sprites";

// A sprite's colour paths; the outline reads --mascot-outline (globals.css).
// Shared by Sprite and the desk.
export const SpritePaths = ({ paths }) =>
  paths.map(({ key, d }) =>
    key === "O" ? (
      <path key={key} d={d} className="mascot-outline" />
    ) : (
      <path key={key} d={d} fill={PALETTE[key]} />
    ),
  );

// One pose of Mini Justine as a crisp SVG that fills its parent. Server-safe.
// In poses with eyes, .mascot-eyes is the blink target and .mascot-pupils
// shifts by --look (set by HeroMascot).
const Sprite = ({ pose, className = "" }) => {
  const { width, height, paths, whites, pupils } = POSE_LAYERS[pose];

  return (
    <svg
      className={`mascot-sprite ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <SpritePaths paths={paths} />
      {whites && (
        <g className="mascot-eyes">
          <path d={whites} fill={PALETTE.W} />
          <path d={pupils} fill={PALETTE.K} className="mascot-pupils" />
        </g>
      )}
    </svg>
  );
};

export default Sprite;
