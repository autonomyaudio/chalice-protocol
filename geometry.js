// geometry.js
// 7 rings (levels), 6 points per ring, radius tapering with height

const LEVELS = 7;
const POINTS_PER_RING = 6;
const HEIGHT = 18; // metres, total structure height
const R_BASE = 1.43 / (2 * Math.sin(Math.PI / POINTS_PER_RING)); // back-calc radius from your d=1.43m spacing at level 1
const R_TOP = 4.03 / (2 * Math.sin(Math.PI / POINTS_PER_RING));  // back-calc radius from your d=4.03m spacing at level 7

function radiusAt(levelIndex) {
  // linear taper from base to top, levelIndex 0..LEVELS-1
  const t = levelIndex / (LEVELS - 1);
  return R_BASE + t * (R_TOP - R_BASE);
}

function generateElements() {
  const elements = [];
  for (let lvl = 0; lvl < LEVELS; lvl++) {
    const z = (lvl / (LEVELS - 1)) * HEIGHT;
    const r = radiusAt(lvl);
    for (let p = 0; p < POINTS_PER_RING; p++) {
      const theta = (2 * Math.PI * p) / POINTS_PER_RING;
      elements.push({
        id: lvl * POINTS_PER_RING + p,
        level: lvl,
        x: r * Math.cos(theta),
        y: r * Math.sin(theta),
        z: z,
      });
    }
  }
  return elements;
}

module.exports = { generateElements, radiusAt, LEVELS, POINTS_PER_RING, HEIGHT };
