"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((v) => v);

  // 1. Budujemy dane dla Google
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
        "name": segment.replace(/-/g, " ").toUpperCase(),
        "item": `${baseUrl}${path}`
      };
    })
  ]
};

  return (
    <nav aria-label="Breadcrumb">
      {/* 2. Wstrzykujemy skrypt dla wyszukiwarek (niewidoczny dla użytkownika) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />

      {/* 3. Renderujemy UI dla użytkownika */}
      <div className="flex items-center space-x-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-800 transition-colors">
          Strona Główna
        </Link>
        {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;

        return (
            <span key={href} className="flex items-center">
            <span className="mx-2">/</span>
            {isLast ? (
                <span className="font-medium text-slate-800 capitalize">
                {segment.replace(/-/g, " ")}
                </span>
            ) : (
                <Link href={href} className="hover:text-slate-800 transition-colors capitalize">
                {segment.replace(/-/g, " ")}
                </Link>
            )}
            </span>
        );
        })}
      </div>
    </nav>
  );
}