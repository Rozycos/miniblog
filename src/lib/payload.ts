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
 * Pobiera pojedynczy post na podstawie sluga
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Dekodujemy tutaj raz a dobrze
  const cleanSlug = decodeURIComponent(slug);
  
  const res = await fetch(`${PAYLOAD_API_URL}/posts?where[slug][equals]=${cleanSlug}&depth=2`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) throw new Error('Błąd podczas pobierania posta');
  const data = await res.json();
  
  return data.docs?.[0] || null;
}