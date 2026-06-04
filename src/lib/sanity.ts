import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: 'a7x1hmck',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01'
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  mainImage?: SanityImageSource;
  categories?: { title: string }[];
  author?: { name: string; image?: SanityImageSource };
  body?: PortableTextBlock[];
}

export interface PortableTextBlock {
  _type: string;
  _key: string;
  style?: string;
  children?: { _key: string; _type: string; text: string; marks?: string[] }[];
  markDefs?: unknown[];
  asset?: SanityImageSource;
}
