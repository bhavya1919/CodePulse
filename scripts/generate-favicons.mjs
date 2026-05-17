import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const src = "public/favicon.png";

// Trim empty/dark margins, then fill the square so the mark reads larger at 16px in the tab bar.
const base = await sharp(src)
  .trim({ threshold: 12 })
  .resize(512, 512, { fit: "cover", position: "centre" })
  .png()
  .toBuffer();

const outputs = [
  ["public/favicon-16x16.png", 16],
  ["public/favicon-32x32.png", 32],
  ["public/favicon.png", 32],
  ["public/favicon-180x180.png", 180],
  ["public/favicon-192x192.png", 192],
  ["public/favicon-512x512.png", 512],
];

for (const [file, size] of outputs) {
  await sharp(base).resize(size, size, { kernel: sharp.kernel.lanczos3 }).png().toFile(file);
}

// Single-size ICO (32px) for older browsers
await sharp(base).resize(32, 32).png().toFile("public/favicon.ico");

console.log("Favicons generated:", outputs.map(([f]) => f).join(", "), "favicon.ico");
