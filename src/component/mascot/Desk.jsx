import { SpritePaths } from "@/component/mascot/Sprite";
import { DESK_CODE_LAYERS, DESK_LAYERS } from "@/lib/mascot/sprites";
import { DESK_H, DESK_W } from "@/lib/mascot/stage";

// The dual-monitor desk at the right end of the hero stage, with the glow
// the lit monitors cast behind it. The glow and the screens' code (two
// frames) show only while Mini Justine sits here (globals.css). Server-safe.
const Desk = () => (
  <div className="absolute bottom-0 right-0" style={{ width: DESK_W, height: DESK_H }}>
    <div className="mascot-glow" aria-hidden="true" />
    <svg
      className="relative block"
      width={DESK_W}
      height={DESK_H}
      viewBox={`0 0 ${DESK_LAYERS.width} ${DESK_LAYERS.height}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <SpritePaths paths={DESK_LAYERS.paths} />
      {DESK_CODE_LAYERS.map((paths, i) => (
        <g key={i} className={i === 0 ? "mascot-code" : "mascot-code mascot-code-b"}>
          <SpritePaths paths={paths} />
        </g>
      ))}
    </svg>
  </div>
);

export default Desk;
