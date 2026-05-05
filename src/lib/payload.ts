import { Post } from '@/types/payload';
export type { Post };

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL;
if (!PAYLOAD_API_URL) {
  throw new Error("Brak zdefiniowanej zmiennej PAYLOAD_API_URL w pliku .env");
}

/**
 * Pobiera listę wszystkich opublikowanych postów + paginator (default 2)
 */
export async function getPosts(page: number = 1, limit: number = 2) {
  const res = await fetch(
    `${process.env.PAYLOAD_API_URL}/posts?where[status][equals]=published&sort=-publishedDate&depth=2&page=${page}&limit=${limit}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error('Błąd pobierania postów');

  const data = await res.json();

  return {
    posts: data.docs as Post[],
    totalPages: data.totalPages,
    hasNextPage: data.hasNextPage,
    hasPrevPage: data.hasPrevPage,
    currentPage: data.page,
  };
}

/**
 * POBIERANIE PO ID (Kluczowe dla struktury slug,idID)
 */
export async function getPostById(id: string): Promise<Post | null> {
  try {
    // Używamy filtra where, aby wymusić status 'published'
    const res = await fetch(
      `${PAYLOAD_API_URL}/posts?where[id][equals]=${id}&where[status][equals]=published&depth=2`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return null;
    const data = await res.json();
    
    return data.docs?.[0] || null;
  } catch (error) {
    console.error("Błąd getPostById:", error);
    return null;
  }
}

// Zachowujemy dla kompatybilności (do starego SEO itp.)
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(
    `${PAYLOAD_API_URL}/posts?where[slug][equals]=${slug}&where[status][equals]=published&depth=2`
  );
  const data = await res.json();
  return data.docs?.[0] || null;
}