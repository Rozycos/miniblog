import Image from 'next/image';
import Link from 'next/link';
import { getPosts, Post } from '@/lib/payload';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Pagination from '@/components/ui/Pagination';

export const metadata: Metadata = {
  title: 'Mój Blog - Najnowsze Artykuły',
  description: 'Zapraszam do czytania moich wpisów na temat technologii i nie tylko.',
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { posts, totalPages, hasNextPage, hasPrevPage } = await getPosts(currentPage);

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 font-sans">
      <Breadcrumbs />
      <header className="mb-16">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight uppercase">
          Lista Artykułów
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {posts && posts.length > 0 ? (
          posts.map((post: Post) => (
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
                    <>
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {post.author.username}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                    </>
                  )}
                  
                  <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">Artykuł</span>
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
          ))
        ) : (
          <p className="text-slate-500 italic">Brak artykułów na tej stronie.</p>
        )}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        baseUrl="/blog"
      />
    </main>
  );
}