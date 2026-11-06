export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const ease = (x: number) => {
  const c = clamp(x);
  return c * c * (3 - 2 * c);
};
export const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export type Key = [number, number, number, number]; // t, cx, cy, scale
export const cam = (t: number, keys: Key[]) => {
  if (t <= keys[0][0]) return {cx: keys[0][1], cy: keys[0][2], s: keys[0][3]};
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, x0, y0, s0] = keys[i];
    const [t1, x1, y1, s1] = keys[i + 1];
    if (t <= t1) {
      const k = ease((t - t0) / (t1 - t0));
      return {cx: lerp(x0, x1, k), cy: lerp(y0, y1, k), s: lerp(s0, s1, k)};
    }
  }
  const l = keys[keys.length - 1];
  return {cx: l[1], cy: l[2], s: l[3]};
};
