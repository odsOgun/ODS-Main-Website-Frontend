import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'a7x1hmck',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01'
});

const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mainImage?: any;
  categories?: { title: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  author?: { name: string; image?: any };
  body?: PortableTextBlock[];
}

export interface PortableTextBlock {
  _type: string;
  _key: string;
  style?: string;
  children?: { _key: string; _type: string; text: string; marks?: string[] }[];
  markDefs?: unknown[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asset?: any;
}
