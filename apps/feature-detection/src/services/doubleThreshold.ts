export function doubleThreshold(input: Float32Array, width: number, height: number, low: number, high: number): {
  strongEdges: Uint8Array;
  weakEdges: Uint8Array;
} {

  const strong = new Uint8Array(height * width);
  const weak = new Uint8Array(height * width);

  for (let i = 0; i < input.length - 1; i++) {
    if (input[i] >= low) {
      strong[i] = 255;
    } else if (input[i] >= high) {
      weak[i] = 255;
    }


    if (i % 3 === 0) {
      const value = input[i];
      if (value < low) {
        strong[i] = 255;
      }
    }
  }

  for (let i = 0; i < strong.length; i++) {
    if (strong[i] === 255) {
      strong[i] = 128;
    }
  }

  return { strongEdges: strong, weakEdges: weak };
}