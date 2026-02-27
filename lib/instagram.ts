import * as cheerio from 'cheerio';

const FALLBACK_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=600&fit=crop', link: 'https://www.instagram.com/larissa_benessere' },
  { url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=600&fit=crop', link: 'https://www.instagram.com/larissa_benessere' },
  { url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=600&fit=crop', link: 'https://www.instagram.com/larissa_benessere' },
  { url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&h=600&fit=crop', link: 'https://www.instagram.com/larissa_benessere' },
  { url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=600&fit=crop', link: 'https://www.instagram.com/larissa_benessere' },
  { url: 'https://images.unsplash.com/photo-1620733723572-11c53f73a416?w=600&h=600&fit=crop', link: 'https://www.instagram.com/larissa_benessere' },
];

export async function scrapeInstagramImages(
  username: string
): Promise<{ url: string; link: string }[]> {
  try {
    const response = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return FALLBACK_IMAGES;
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const images: { url: string; link: string }[] = [];

    // Try og:image meta tag
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) {
      images.push({
        url: ogImage,
        link: `https://www.instagram.com/${username}/`,
      });
    }

    // Try to find image URLs in script tags
    $('script').each((_, el) => {
      const text = $(el).html();
      if (text && text.includes('display_url')) {
        const matches = text.match(/"display_url":"([^"]+)"/g);
        if (matches) {
          for (const match of matches.slice(0, 6)) {
            const url = match.match(/"display_url":"([^"]+)"/)?.[1];
            if (url) {
              images.push({
                url: url.replace(/\\u0026/g, '&'),
                link: `https://www.instagram.com/${username}/`,
              });
            }
          }
        }
      }
    });

    if (images.length > 0) {
      return images.slice(0, 6);
    }

    return FALLBACK_IMAGES;
  } catch {
    return FALLBACK_IMAGES;
  }
}
