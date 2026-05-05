"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((v) => v);

  // Funkcja czyszcząca segment ze znacznika ID
  const formatSegment = (segment: string) => {
    const decoded = decodeURIComponent(segment);
    // Jeśli segment zawiera ,id, bierzemy tylko część przed przecinkiem
    const clean = decoded.includes(',id') ? decoded.split(',id')[0] : decoded;
    return clean.replace(/-/g, " ");
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Strona Główna",
        "item": baseUrl
      },
      ...pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": formatSegment(segment).toUpperCase(),
          "item": `${baseUrl}${path}`
        };
      })
    ]
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />

      <div className="flex items-center space-x-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-800 transition-colors">
          Strona Główna
        </Link>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;
          const label = formatSegment(segment);

          return (
            <span key={href} className="flex items-center">
              <span className="mx-2 text-slate-300">/</span>
              {isLast ? (
                <span className="font-medium text-slate-800 capitalize line-clamp-1">
                  {label}
                </span>
              ) : (
                <Link href={href} className="hover:text-slate-800 transition-colors capitalize">
                  {label}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}