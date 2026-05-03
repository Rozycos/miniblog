import { Post } from '@/types/payload';

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL;
if (!PAYLOAD_API_URL) {
  throw new Error("Brak zdefiniowanej zmiennej PAYLOAD_API_URL w pliku .env");
}

/**
 * Pobiera listę wszystkich opublikowanych postów
 */
export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${PAYLOAD_API_URL}/posts?where[status][equals]=published&sort=-publishedDate&depth=2`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) throw new Error('Błąd podczas pobierania listy postów');
  const data = await res.json();
  return data.docs;
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