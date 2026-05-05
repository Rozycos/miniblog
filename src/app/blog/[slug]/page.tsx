import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { getPostById } from '@/lib/payload'; 
import { RichText } from '@payloadcms/richtext-lexical/react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getPostMetadataById } from '@/lib/seo';
import { ROUTES } from '@/lib/routes';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Funkcja pomocnicza do wyciągania ID
 */
function parseSlugWithId(rawSlug: string) {
  const decoded = decodeURIComponent(rawSlug);
  if (!decoded.includes(',id')) return { titlePart: null, id: null };
  
  const [titlePart, id] = decoded.split(',id');
  return { titlePart, id };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return getPostMetadataById(slug);
}

export const revalidate = 3600;

export default async function PostPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  
  // 1. Rozcinamy URL
  const { titlePart, id } = parseSlugWithId(rawSlug);
  
  if (!id) notFound();

  // 2. Pobieramy dane po ID
  const post = await getPostById(id);

  if (!post) notFound();

  // 3. SEO CHECK: Jeśli ktoś ręcznie zmienił slug w adresie, ale ID jest dobre, 
  // przekierowujemy na poprawny adres (kanoniczny).
  if (post.slug !== titlePart) {
    redirect(`${ROUTES.blog.index}/${post.slug},id${post.id}`);
  }

  const hero = post.heroImage;
  const imageUrl = hero?.url || '';
  const altText = hero?.alt || post.title;

  return (
    <article className="max-w-3xl mx-auto px-6 py-20 font-sans"> 
      <header className="mb-10">
        <Breadcrumbs/>
        <div className="flex items-center gap-3 mb-4">
          <time className="text-sm text-slate-400">
            {new Date(post.publishedDate || post.createdAt).toLocaleDateString('pl-PL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          {post.author?.username && (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
              Autor: {post.author.username}
            </span>
          )}
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
          {post.title}
        </h1>
      </header>

      {imageUrl && (
        <div className="relative aspect-video mb-12 rounded-2xl overflow-hidden bg-slate-100 shadow-lg border border-slate-200">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}

      <div className="prose prose-slate lg:prose-xl max-w-none">
        {post.content && <RichText data={post.content} />}
      </div>
      
      <footer className="mt-16 pt-8 border-t border-slate-100">
        <p className="text-sm text-slate-400 italic">
          Ostatnia aktualizacja: {new Date(post.updatedAt).toLocaleDateString('pl-PL')}
        </p>
      </footer>
    </article>
  );
}