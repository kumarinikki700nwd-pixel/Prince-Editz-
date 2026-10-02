import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function generatePng(width, height, isMaskable = false) {
  const header = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit depth
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with 1 byte filter per line
  const rowLength = width * 4 + 1;
  const rawData = Buffer.alloc(rowLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const nx = x / width;
      const ny = y / height;

      // Base gradient: indigo #4f46e5 to violet #7c3aed
      let r = Math.round(79 + (124 - 79) * ny);
      let g = Math.round(70 + (58 - 70) * ny);
      let b = Math.round(229 + (237 - 229) * ny);
      let a = 255;

      // Inner notepad box
      const pad = isMaskable ? 0.22 : 0.16;
      if (nx >= pad && nx <= (1 - pad) && ny >= pad && ny <= (1 - pad)) {
        // Notepad sheet
        const sheetNy = (ny - pad) / (1 - pad * 2);
        const sheetNx = (nx - pad) / (1 - pad * 2);
        
        // Notepad top bar
        if (sheetNy < 0.18) {
          r = 99; g = 102; b = 241; // #6366f1
        } else {
          // White paper
          r = 255; g = 255; b = 255;

          // Ruled stripes
          if (sheetNy > 0.28 && sheetNy < 0.32 && sheetNx > 0.15 && sheetNx < 0.75) {
            r = 67; g = 56; b = 202; // #4338ca title line
          } else if (sheetNy > 0.40 && sheetNy < 0.43 && sheetNx > 0.15 && sheetNx < 0.85) {
            r = 203; g = 213; b = 225; // line
          } else if (sheetNy > 0.50 && sheetNy < 0.53 && sheetNx > 0.15 && sheetNx < 0.80) {
            r = 203; g = 213; b = 225; // line
          } else if (sheetNy > 0.60 && sheetNy < 0.63 && sheetNx > 0.15 && sheetNx < 0.70) {
            r = 203; g = 213; b = 225; // line
          } else if (sheetNy > 0.72 && sheetNy < 0.88 && sheetNx > 0.15 && sheetNx < 0.55) {
            // Red PDF badge
            r = 239; g = 68; b = 68; // #ef4444
          }
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generatePng(32, 32, false));

console.log('PWA & App icons generated successfully in public/');
