import Image from 'next/image';
import Link from 'next/link';
import { getPosts, Post } from '@/lib/payload';

interface PostListProps {
  posts?: Post[]; // Dane przekazane z zewnątrz (np. ze strony Blog)
  limit?: number; // Jeśli brak 'posts', pobierze tyle sztuk (np. na stronie Głównej)
}

export default async function PostList({ posts: initialPosts, limit }: PostListProps) {
  let posts = initialPosts;

  // Logika dla Opcji A: Samodzielne pobieranie danych jeśli ich nie przekazano
  if (!posts && limit) {
    const data = await getPosts(1, limit);
    posts = data.posts;
  }

  if (!posts || posts.length === 0) {
    return <p className="text-slate-500 italic">Brak artykułów do wyświetlenia.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-12">
      {posts.map((post: Post) => (
        <article key={post.id} className="group flex flex-col md:flex-row gap-8 items-start">
          {/* Miniaturka */}
          <div className="w-full md:w-1/3 aspect-video relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
            <Image
              src={post.heroImage?.sizes?.thumbnail?.url || post.heroImage?.url || '/placeholder.jpg'}
              alt={post.heroImage?.alt || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          {/* Treść */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <time className="text-sm text-slate-400">
                {new Date(post.publishedDate || post.createdAt).toLocaleDateString('pl-PL')}
              </time>
              <span className="h-1 w-1 rounded-full bg-slate-300"></span>
              {post.author?.username && (
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{post.author.username}</span>
              )}
            </div>
            
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
            </Link>
            
            <p className="text-slate-600 leading-relaxed mb-6 line-clamp-2">
              {post.excerpt}
            </p>
            
            <Link 
              href={`/blog/${post.slug}`}
              className="text-sm font-bold text-slate-900 group-hover:gap-2 flex items-center gap-1 transition-all"
            >
              Czytaj dalej <span>→</span>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}