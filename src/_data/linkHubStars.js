/**
 * Champ d’étoiles SSR pour /links/ — même approche que phantomdev.fr
 * (static-stars-field + positions déterministes).
 */
function mulberry32(seed) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0x52454b4b); // "REKK"
const sizes = [1.25, 1.75, 2.5];
const COUNT = 120;

module.exports = Array.from({ length: COUNT }, () => {
  const size = sizes[Math.floor(rand() * sizes.length)];
  return {
    left: +(rand() * 100).toFixed(2),
    top: +(rand() * 100).toFixed(2),
    size,
    opacity: +(0.55 + rand() * 0.45).toFixed(2),
    duration: +(2 + rand() * 2.5).toFixed(2),
    delay: +(rand() * 5).toFixed(2),
    glow: rand() < 0.18,
  };
});
