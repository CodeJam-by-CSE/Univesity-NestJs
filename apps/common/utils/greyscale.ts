import * as sharp from 'sharp';

export async function convertToGreyscale(imagePath: string): Promise<{ buffer: Buffer, width: number, height: number }> {
  const { data, info } = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });

  const greyscaleBuffer = Buffer.alloc(info.width * info.height);

  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];

    const y = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    greyscaleBuffer[i] = y;
  }

  return {
    buffer: greyscaleBuffer,
    width: info.width,
    height: info.height
  };
}
