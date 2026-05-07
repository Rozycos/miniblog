import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export interface Media {
  id: string
  url: string
  filename: string
  key?: string; // Klucz z UploadThing
  alt?: string | null
  width?: number
  height?: number
  mimeType?: string | null
  fields?: {
    caption?: string
  }
  sizes?: {
    thumbnail?: {
      url: string
      width: number
      height: number
    }
  }
}

export interface Author {
  id: string;
  email: string;
  role: string;
  username: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  // Używamy unii, bo Payload może zwrócić tylko ID jeśli depth=0
  heroImage: Media | string; 
  excerpt: string;
  content: SerializedEditorState; 
  publishedDate?: string;
  createdAt: string;
  updatedAt: string;
  author: Author | string;
  meta?: {
    title?: string;
    description?: string;
    image?: Media | string | null; 
  };
}

export function isObject<T>(value: T | string | undefined | null): value is T {
  return typeof value === 'object' && value !== null;
}
