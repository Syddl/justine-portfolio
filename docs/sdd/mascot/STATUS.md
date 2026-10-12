---
status: open
feature: mascot
---

# Status: mascot

## Verification ledger

| date | branch | sha | suite | result | duration | not covered |
|---|---|---|---|---|---|---|
| 2026-10-12T06:21:03.471Z | feat/mascot | 02cdfcf3 | `npm run lint && npm test && npm run check:hooks && npm run build` | PASS | 52.9 s | a production deploy, the live site, motion feel in a real browser (wave, bob, blink, hop, eye-follow) and cameo tap behaviour on a real touch device |
| 2026-10-12T07:33:36.046Z | feat/mascot | abc2d963 | `npm run lint && npm test && npm run check:hooks && npm run build` | PASS | 48.4 s | a production deploy, the live site, motion feel in a real browser (walk, drag, fall, idle routine, desk glow) and dragging on a real touch device |
| 2026-10-12T07:40:26.406Z | feat/mascot | e57c9d6a | `npm run lint && npm test && npm run check:hooks && npm run build` | PASS | 48.6 s | a production deploy, the live site, motion feel in a real browser (walk, drag, fall, idle routine) and dragging on a real touch device |
| 2026-10-12T07:44:51.171Z | feat/mascot | 8f1a164f | `npm run lint && npm test && npm run check:hooks && npm run build` | PASS | 52.0 s | a production deploy, the live site, motion feel in a real browser (walk, drag, fall, idle routine) and dragging on a real touch device |

## Port ledger

| Branch | Status | Reference |
|---|---|---|
