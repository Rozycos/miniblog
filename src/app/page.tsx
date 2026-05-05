//import Image from 'next/image';
import Link from 'next/link';
//import { getPosts } from '@/lib/payload';
import PostList from '@/components/blog/PostList';
import { Suspense } from 'react';
// import { Metadata } from 'next';
import { ROUTES } from '@/lib/routes';

// jeśli chcę mieć meta i title dla głównej strony, inny niż w layout.tsx
// export const metadata: Metadata = {
//   title: 'Mój Blog - Najnowsze Artykuły',
//   description: 'Zapraszam do czytania moich wpisów na temat technologii i nie tylko.',
// };

export default async function MainPage() {

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

      <section>
        <h2 className="text-3xl font-bold text-slate-900 mb-10">Najnowsze Posty</h2>
        
        {/* Wrapujemy w Suspense, aby strona ładowała się szybciej (opcjonalnie) */}
        <Suspense fallback={<p className="text-slate-500 animate-pulse">Ładowanie artykułów...</p>}>
          <PostList limit={4} />
        </Suspense>
        
        <div className="mt-12">
          <Link 
            href={ROUTES.blog.index}
            className="inline-block bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
          >
            Zobacz wszystkie artykuły
          </Link>
        </div>
      </section>
    </main>
  );
}