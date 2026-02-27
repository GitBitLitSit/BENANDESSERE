import { NextResponse } from 'next/server';
import { scrapeInstagramImages } from '@/lib/instagram';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const images = await scrapeInstagramImages('larissa_benessere');
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
