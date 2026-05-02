import Image from 'next/image';
import Link from 'next/link';
import { getPosts } from '@/lib/payload';
// import { Metadata } from 'next';

// jeśli chcę mieć meta i title dla głównej strony, inny niż w layout.tsx
// export const metadata: Metadata = {
//   title: 'Mój Blog - Najnowsze Artykuły',
//   description: 'Zapraszam do czytania moich wpisów na temat technologii i nie tylko.',
// };

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 font-sans">
      <header className="mb-16">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Design & Code
        </h1>
        <p className="text-xl text-slate-500">
          Moje przemyślenia o technologii, hostowane na Cloudflare. Jeszcze ten deploy...
        </p>
      </header>

      <div className="mb-16">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magnam aliquam quaerat voluptatem. 
          Ut enim aeque doleamus animo, cum corpore dolemus, fieri tamen permagna accessio potest, si aliquod aeternum et infinitum impendere malum nobis opinemur. 
          Quod idem licet transferre in voluptatem, ut postea variari voluptas distinguique possit, augeri amplificarique non possit. 
          At etiam Athenis, ut e.
          Sis aequitate, quam ostendis. Sed uti oratione perpetua malo quam interrogare aut interrogari. 
          Ut placet, inquam. Tum dicere exorsus est. 
          Primum igitur, inquit, sic agam, ut ipsi auctori huius disciplinae placet: constituam, quid et quale sit id, de quo quaerimus, non quo ignorare vos arbitrer, sed ut ratione et via procedat oratio. 
          Quaerimus igitur, quid sit extremum et ultimum bonorum, quod omnium philosophorum sententia.
          Familiari suo, geometrica discere maluisset quam illum etiam ipsum dedocere. 
          Sol Democrito magnus videtur, quippe homini erudito in geometriaque perfecto, huic pedalis fortasse; 
          tantum enim esse censet, quantus videtur, vel paulo aut maiorem aut minorem. 
          Ita, quae mutat, ea corrumpit, quae sequitur sunt tota Democriti, atomi, inane, imagines, quae eidola nominant, quorum incursione non solum.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <h2>POSTY</h2>
        {posts.map((post) => (
          <article key={post.id} className="group flex flex-col md:flex-row gap-8 items-start">
            {/* Miniaturka */}
            <div className="w-full md:w-1/3 aspect-video relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
              <Image
                // Używamy miniatury (400x300), jeśli istnieje, dla lepszej wydajności listy
                src={post.heroImage.sizes?.thumbnail?.url || post.heroImage.url}
                alt={post.heroImage.alt || post.title}
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
        ))}
      </div>
    </main>
  );
}