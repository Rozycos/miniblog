import Image from 'next/image';
//import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/payload';
// Importujemy komponent RichText z nowej biblioteki
import { RichText } from '@payloadcms/richtext-lexical/react';
//import { generatePostMetadata } from '@/lib/seo' // importujemy nasz helper
import { getPostMetadataBySlug } from '@/lib/seo'
import { Metadata } from 'next'
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return getPostMetadataBySlug(slug)
}

export const revalidate = 3600;

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

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
          {post.author && (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
              Autor: {post.author.email}
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

      {/* --- NOWE RENDEROWANIE TREŚCI --- */}
      <div className="prose prose-slate lg:prose-xl max-w-none">
        {/* Wystarczy podać post.content. RichText zajmie się resztą. */}
        {post.content && <RichText data={post.content} />}
      </div>
      {/* ------------------------------ */}
      
      <footer className="mt-16 pt-8 border-t border-slate-100">
        <p className="text-sm text-slate-400 italic">
          Ostatnia aktualizacja: {new Date(post.updatedAt).toLocaleDateString('pl-PL')}
        </p>
      </footer>
    </article>
  );
}