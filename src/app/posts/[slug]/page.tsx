import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/payload';
import { LexicalNode, LexicalChild } from '@/types/payload';

interface Props {
  params: Promise<{ slug: string }>;
}

// Rewalidacja co 3600 sekund (1 godzina)
export const revalidate = 3600;

export default async function PostPage({ params }: Props) {
  const { slug: encodedSlug } = await params;
  const slug = decodeURIComponent(encodedSlug);
  
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Wyciągamy dane obrazka z nowej struktury JSON
  const hero = post.heroImage;
  const imageUrl = hero?.url || '';
  const altText = hero?.alt || post.title;

  return (
    <article className="max-w-3xl mx-auto px-6 py-20 font-sans">
      <Link 
        href="/" 
        className="text-sm text-slate-500 hover:text-slate-800 mb-8 inline-block transition-colors"
      >
        ← Powrót do listy
      </Link>
      
      <header className="mb-10">
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

      {/* Główne zdjęcie z Cloudflare R2 */}
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

      {/* Renderowanie treści (Lexical Rich Text) */}
      <div className="prose prose-slate lg:prose-xl max-w-none">
        {post.content?.root?.children?.map((node: LexicalNode, index: number) => {
          if (node.type === 'paragraph') {
            return (
              <p key={index} className="mb-4 text-slate-700 leading-relaxed">
                {node.children?.map((child: LexicalChild, i: number) => {
                  // Bezpieczne sprawdzenie formatowania bitowego dla Bold
                  const isBold = typeof child.format === 'number' && (child.format & 1);
                  
                  return (
                    <span 
                      key={i} 
                      className={isBold ? 'font-bold text-slate-900' : ''}
                    >
                      {child.text}
                    </span>
                  );
                })}
              </p>
            );
          }
          // Możesz tu dodać obsługę innych typów (heading, list) w przyszłości
          return null;
        })}
      </div>
      
      <footer className="mt-16 pt-8 border-t border-slate-100">
        <p className="text-sm text-slate-400 italic">
          Ostatnia aktualizacja: {new Date(post.updatedAt).toLocaleDateString('pl-PL')}
        </p>
      </footer>
    </article>
  );
}