import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export interface Media {
  id: string;
  url: string;
  alt: string;
  filename: string;
  sizes?: {
    thumbnail?: {
      url: string;
      width: number;
      height: number;
    };
  };
}

export interface Author {
  id: string;
  email: string;
  role: string;
  username: string;
}

/**
 * Struktura węzła tekstowego w edytorze Lexical
 */
export interface LexicalChild {
  text?: string;
  type: string;
  format?: number;
  style?: string;
  detail?: number;
  mode?: string;
  version?: number;
  children?: LexicalChild[]; // Dla zagnieżdżonych struktur typu linki
}

/**
 * Struktura bloku (np. paragraf, nagłówek) w edytorze Lexical
 */
export interface LexicalNode {
  type: string;
  format?: string;
  indent?: number;
  version?: number;
  children?: LexicalChild[];
  direction?: 'ltr' | 'rtl' | null;
  [key: string]: unknown; // Pozwala na dodatkowe pola specyficzne dla bloków
}

/**
 * Główny obiekt treści
 */
export interface LexicalContent {
  root: {
    type: string;
    children: LexicalNode[];
    direction: 'ltr' | 'rtl' | null;
    format: string;
    indent: number;
    version: number;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  heroImage: Media;
  excerpt: string;
  content: SerializedEditorState; 
  publishedDate?: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  meta?: {
    title?: string;
    description?: string;
    // Używamy interfejsu Media, bo to osobna kolekcja
    image?: Media | null; 
  };
}