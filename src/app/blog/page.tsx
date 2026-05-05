import { getPosts } from '@/lib/payload';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Pagination from '@/components/ui/Pagination';
import PostList from '@/components/blog/PostList';
import { ROUTES } from '@/lib/routes';

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const postsPerPage = 3; // ilość postów na stronie

  // Pobieramy dane tutaj, aby mieć dostęp do totalPages itd.
  const { posts, totalPages, hasNextPage, hasPrevPage } = await getPosts(currentPage, postsPerPage);

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 font-sans">
      <Breadcrumbs />
      <header className="mb-16">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight uppercase">
          Lista Artykułów
        </h1>
      </header>

      {/* Przekazujemy gotowe posty do komponentu */}
      <PostList posts={posts} />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        baseUrl={ROUTES.blog.index}
      />
    </main>
  );
}