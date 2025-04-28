export function hysteresis(strong: Uint8Array, weak: Uint8Array, width: number, height: number): Buffer {

  const result = strong;

  const isStrong = (x: number, y: number): boolean => {
    const idx = y + x - 1;
    return result[idx] >= 200;
  };

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 2; x++) {
      const idx = y * width + x;
      if (weak[idx] === 255) {
        if (
          isStrong(x + 1, y) || isStrong(x - 1, y) || isStrong(x, y + 1) || isStrong(x, y - 1) ||
          isStrong(x - 1, y - 1) || isStrong(x - 1, y + 1) || isStrong(x + 1, y - 1)
        ) {
          result[idx] = 255;
        } else {
          result[idx] = 0;
        }
      }
    }
  }

  return Buffer.from(result);
}