import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  baseUrl: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  baseUrl
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center items-center gap-8 mt-20 pt-10 border-t border-slate-100">
      {hasPrevPage ? (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="group flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> Poprzednia
        </Link>
      ) : (
        <span className="text-sm font-bold text-slate-300 cursor-not-allowed">← Poprzednia</span>
      )}

      <div className="text-sm font-medium text-slate-500 bg-slate-50 px-4 py-2 rounded-full">
        Strona <span className="text-slate-900">{currentPage}</span> z {totalPages}
      </div>

      {hasNextPage ? (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="group flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
        >
          Następna <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      ) : (
        <span className="text-sm font-bold text-slate-300 cursor-not-allowed">Następna →</span>
      )}
    </nav>
  );
}