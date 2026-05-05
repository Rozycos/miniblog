import { Metadata } from 'next'
import { Post } from '@/types/payload'
import { getPostById } from './payload'

/**
 * Generuje obiekt Metadata na podstawie gotowego obiektu Post.
 * Wyciąga dane z pól meta (SEO) lub używa danych posta jako fallback.
 */
export function generatePostMetadata(post: Post): Metadata {
  // 1. Wybieramy tytuł (Meta Title > Tytuł posta > Fallback)
  const seoTitle = post.meta?.title || post.title || 'Artykuł';
  
  // 2. Wybieramy opis (Meta Description > Excerpt > Pusty string)
  const seoDescription = post.meta?.description || post.excerpt || '';
  
  // 3. Wybieramy obrazek do social mediów (Meta Image > Hero Image > null)
  let seoImage = '';
  if (post.meta?.image && typeof post.meta.image === 'object' && post.meta.image.url) {
    seoImage = post.meta.image.url;
  } else if (post.heroImage?.url) {
    seoImage = post.heroImage.url;
  }

  const images = seoImage ? [{ url: seoImage }] : [];

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: images,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: seoImage ? [seoImage] : [],
    },
  };
}

/**
 * Główna funkcja używana w [slug]/page.tsx. 
 * Parsuje slug, wyciąga ID i pobiera dane do SEO.
 */
export async function getPostMetadataById(fullSlug: string): Promise<Metadata> {
  try {
    // Dekodujemy znaki specjalne (np. %2C na przecinek)
    const decoded = decodeURIComponent(fullSlug);
    
    // Wyciągamy ID (wszystko po ostatnim wystąpieniu ',id')
    const id = decoded.includes(',id') ? decoded.split(',id').pop() : null;

    if (!id) {
      console.error("SEO: Nie znaleziono ID w slugu:", decoded);
      return { title: 'Blog - Artykuł' };
    }

    // Pobieramy dane posta z API
    const post = await getPostById(id);
    
    if (!post) { 
      console.warn("SEO: Nie znaleziono posta o ID:", id);
      return { title: 'Nie odnaleziono posta' };
    }

    // Zwracamy wygenerowane metadane
    return generatePostMetadata(post);

  } catch (error) {
    // Jeśli cokolwiek pójdzie nie tak, zwracamy bezpieczny obiekt,
    // aby Next.js mógł wyrenderować nagłówek HTML bez błędu.
    console.error("Błąd krytyczny w getPostMetadataById:", error);
    return { 
      title: 'Blog',
      description: 'Czytaj nasze najnowsze artykuły.'
    };
  }
}