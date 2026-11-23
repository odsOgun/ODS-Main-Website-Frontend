import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Newspaper, PenSquare } from 'lucide-react';
import { client, urlFor, type Post } from '@/lib/sanity';
import { fmtDate } from '../../hackathon-portal/lib/format';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  QueryState
} from '../../hackathon-portal/components/ui';

/**
 * The public /news pages are powered by Sanity, so posts are written and edited in Sanity Studio
 * (/studio). This page lists what is currently published and links into the Studio.
 */
export default function News() {
  const posts = useQuery({
    queryKey: ['site', 'sanity-posts'],
    queryFn: () =>
      client.fetch<Post[]>(
        `*[_type == "post"] | order(publishedAt desc)[0...100]{_id, title, slug, publishedAt, excerpt, mainImage, featured, categories[]->{title}, author->{name}}`
      )
  });
  return (
    <div>
      <PageHeader
        title='News'
        description='Posts on the public News page. Write, edit and publish them in Sanity Studio.'
        actions={
          <a href='/studio' target='_blank' rel='noreferrer'>
            <Button icon={PenSquare}>Open Studio</Button>
          </a>
        }
      />
      <Card bodyClass='p-0'>
        <QueryState
          query={posts}
          isEmpty={(d) => !d.length}
          empty={<EmptyState icon={Newspaper} title='No published posts yet' />}
        >
          {(d: Post[]) => (
            <ul className='divide-y divide-[#F2F4F7]'>
              {d.map((post) => (
                <li key={post._id} className='flex items-center gap-4 px-4 py-3'>
                  {post.mainImage ? (
                    <img
                      src={urlFor(post.mainImage).width(160).height(100).fit('crop').url()}
                      alt=''
                      className='h-14 w-20 shrink-0 rounded-lg object-cover'
                    />
                  ) : (
                    <div className='flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-[#F2F4F7]'>
                      <Newspaper className='size-5 text-[#98A2B3]' />
                    </div>
                  )}
                  <div className='min-w-0 flex-1'>
                    <p className='truncate font-medium text-[#101828]'>{post.title}</p>
                    <p className='truncate text-xs text-[#667085]'>
                      {post.publishedAt ? fmtDate(post.publishedAt) : 'Not scheduled'}
                      {post.author?.name ? ` · ${post.author.name}` : ''}
                      {post.categories?.length
                        ? ` · ${post.categories.map((c) => c.title).join(', ')}`
                        : ''}
                    </p>
                  </div>
                  {post.featured && <Badge tone='violet'>Featured</Badge>}
                  <div className='flex shrink-0 gap-1'>
                    <a
                      href={`/studio/structure/post;${post._id}`}
                      target='_blank'
                      rel='noreferrer'
                      className='rounded-lg px-2 py-1 text-xs font-medium text-[#009E49] hover:bg-[#E6F6EC]'
                    >
                      Edit
                    </a>
                    {post.slug?.current && (
                      <a
                        href={`/news/${post.slug.current}`}
                        target='_blank'
                        rel='noreferrer'
                        aria-label='View on site'
                        className='rounded-lg p-1.5 text-[#667085] hover:bg-[#F2F4F7]'
                      >
                        <ExternalLink className='size-4' />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </QueryState>
      </Card>
    </div>
  );
}
