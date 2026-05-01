import { Metadata } from 'next'
import { Post } from '@/types/payload'

export function generatePostMetadata(post: Post): Metadata {
  const seoTitle = post.meta?.title || post.title
  const seoDescription = post.meta?.description || post.excerpt
  
  // Bezpieczne wyciąganie obrazka - logicznie odizolowane tutaj
  const seoImage = (typeof post.meta?.image === 'object' && post.meta.image?.url) 
    ? post.meta.image.url 
    : post.heroImage?.url

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: seoImage ? [{ url: seoImage }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: seoImage ? [seoImage] : [],
    },
  }
}