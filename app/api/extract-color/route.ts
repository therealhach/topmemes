import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: NextRequest) {
  const imageUrl = request.nextUrl.searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ color: '#f59e0b' });
  }

  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return NextResponse.json({ color: '#f59e0b' });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use sharp to get raw pixel data
    const { data, info } = await sharp(buffer)
      .resize(50, 50, { fit: 'cover' }) // Resize for faster processing
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Color buckets for finding dominant color
    const colorCounts: { [key: string]: { r: number; g: number; b: number; count: number } } = {};
    const channels = info.channels;

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = channels === 4 ? data[i + 3] : 255;

      // Skip transparent pixels
      if (a < 128) continue;

      // Skip very dark pixels (black backgrounds)
      if (r + g + b < 50) continue;

      // Skip very light/white pixels
      if (r + g + b > 700) continue;

      // Skip grayish pixels (we want colorful ones)
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      if (saturation < 0.2) continue; // Skip low saturation (gray)

      // Bucket colors (reduce precision for grouping)
      const bucketR = Math.round(r / 24) * 24;
      const bucketG = Math.round(g / 24) * 24;
      const bucketB = Math.round(b / 24) * 24;
      const key = `${bucketR}-${bucketG}-${bucketB}`;

      if (!colorCounts[key]) {
        colorCounts[key] = { r: 0, g: 0, b: 0, count: 0 };
      }
      colorCounts[key].r += r;
      colorCounts[key].g += g;
      colorCounts[key].b += b;
      colorCounts[key].count++;
    }

    // Find most common colorful color
    let maxCount = 0;
    let dominantColor = { r: 245, g: 158, b: 11 }; // Default amber

    for (const key in colorCounts) {
      if (colorCounts[key].count > maxCount) {
        maxCount = colorCounts[key].count;
        const c = colorCounts[key];
        dominantColor = {
          r: Math.round(c.r / c.count),
          g: Math.round(c.g / c.count),
          b: Math.round(c.b / c.count),
        };
      }
    }

    // Boost brightness if too dark for visibility on dark background
    let { r, g, b } = dominantColor;
    const lightness = (r + g + b) / 3;

    if (lightness < 120) {
      const boost = (120 - lightness) * 0.7;
      r = Math.min(255, Math.round(r + boost));
      g = Math.min(255, Math.round(g + boost));
      b = Math.min(255, Math.round(b + boost));
    }

    return NextResponse.json({
      color: `rgb(${r}, ${g}, ${b})`
    });
  } catch (error) {
    console.error('Error extracting color:', error);
    return NextResponse.json({ color: '#f59e0b' });
  }
}
