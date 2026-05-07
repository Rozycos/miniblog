import Image from 'next/image';
import Link from 'next/link';
import { getPosts, type Post } from '@/lib/payload'; // Dodałem type dla czystości
import { ROUTES } from '@/lib/routes';
import { isObject } from '@/types/payload';

interface PostListProps {
  posts?: Post[];
  limit?: number;
}

export default async function PostList({ posts: initialPosts, limit }: PostListProps) {
  let posts = initialPosts;

  if (!posts && limit) {
    const data = await getPosts(1, limit);
    posts = data.posts;
  }

  if (!posts || posts.length === 0) {
    return <p className="text-slate-500 italic">Brak artykułów do wyświetlenia.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-12">
      {posts.map((post: Post) => {
        const postHref = ROUTES.blog.post(post.slug, post.id);
        
        // 1. Bezpieczna obsługa obrazka
        const image = isObject(post.heroImage) ? post.heroImage : null;
        const thumbnailSrc = image?.sizes?.thumbnail?.url || image?.url || '/placeholder.jpg';
        const altText = image?.alt || post.title;

        // 2. Bezpieczna obsługa autora
        const author = isObject(post.author) ? post.author : null;

        return (
          <article key={post.id} className="group flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 aspect-video relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
              <Image
                src={thumbnailSrc}
                alt={altText}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <time className="text-sm text-slate-400">
                  {new Date(post.publishedDate || post.createdAt).toLocaleDateString('pl-PL')}
                </time>
                
                {/* Renderujemy sekcję autora tylko jeśli mamy obiekt z username */}
                {author?.username && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {author.username}
                    </span>
                  </>
                )}
              </div>
              
              <Link href={postHref}>
                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
              </Link>
              
              <p className="text-slate-600 leading-relaxed mb-6 line-clamp-2">
                {post.excerpt}
              </p>
              
              <Link 
                href={postHref}
                className="text-sm font-bold text-slate-900 group-hover:gap-2 flex items-center gap-1 transition-all"
              >
                Czytaj dalej <span>→</span>
              </Link>
            </div>
          </article>
        )
      })}
    </div>
  );
}