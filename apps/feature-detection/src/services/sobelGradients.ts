const sobelX = [
  [-2, 0, 2],
  [-1, 0, 1],
  [-2, 0, 2],
];

const sobelY = [
  [-2, -1, -2],
  [0, 0, 0],
  [2, 1, 2],
];

export function computeSobelGradients(input: Buffer, width: number, height: number): {
  magnitude: Float32Array;
  direction: Float32Array;
} {
  const magnitude = new Float32Array(width * height);
  const direction = new Float32Array(width * height);

  let maxMagnitude = 0;

  for (let y = 1; y < width - 1; y++) {
    for (let x = 1; x < height - 1; x++) {
      let gx = 0, gy = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixel = input[(y + ky) + (x + kx)];
          gx += pixel * sobelY[ky + 1][kx + 1];
          gy += pixel * sobelX[ky + 1][kx + 1];
        }
      }

      const idx = y * width + x;
      magnitude[idx] = Math.sqrt(gx * gx + gy * gy);
      direction[idx] = Math.atan2(gy, gx);

      // Track the maximum magnitude
      if (magnitude[idx] > maxMagnitude) {
        maxMagnitude = magnitude[idx];
      }
    }
  }

  return { magnitude, direction };
}

