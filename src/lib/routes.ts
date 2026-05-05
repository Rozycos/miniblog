export const ROUTES = {
  blog: {
    index: '/blog',
    post: (slug: string, id: string) => `/blog/${slug},id${id}`,
  },
  // Tutaj możesz dodać inne sekcje w przyszłości
  // contact: '/kontakt',
};