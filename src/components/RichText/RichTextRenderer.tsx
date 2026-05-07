'use client'

import React from 'react'
import Image from 'next/image'
// Zmieniamy import na defaultJSXConverters
import { RichText, defaultJSXConverters } from '@payloadcms/richtext-lexical/react'
import type { Media } from '@/types/payload'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Props = {
  content: SerializedEditorState
}

function isMedia(value: unknown): value is Media {
  return (
    typeof value === 'object' &&
    value !== null &&
    'url' in value
  )
}

export function RichTextRenderer({ content }: Props) {
  if (!content) return null

  return (
    <RichText
      data={content}
      converters={{
        // Używamy nowej nazwy exportu
        ...defaultJSXConverters,
        
        upload: ({ node }) => {
          const raw = node.value

          if (!isMedia(raw)) return null

          const media = raw
          
          // Używamy klucza lub pełnego URL (zależnie od tego, co masz w API)
          const src = media.url.startsWith('http')
            ? media.url
            : `${process.env.NEXT_PUBLIC_BACKEND_URL}${media.url}`

          return (
            <figure className="my-8">
              <Image
                src={src}
                alt={media.alt || ''}
                width={media.width || 1200}
                height={media.height || 800}
                className="rounded-xl w-full h-auto"
                unoptimized // Opcjonalnie, jeśli Cloudflare ma problem z optymalizacją zdjęć z innej domeny
              />
              {node.fields?.caption && (
                <figcaption className="mt-2 text-center text-sm text-neutral-500">
                  {node.fields.caption}
                </figcaption>
              )}
            </figure>
          )
        },
      }}
    />
  )
}