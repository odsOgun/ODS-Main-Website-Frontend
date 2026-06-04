import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Nav from '@/components/local/nav';
import Footer from '@/components/local/footer';
import { client, urlFor, type Post, type PortableTextBlock } from '@/lib/sanity';

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  categories[]->{ title },
  author->{ name, image },
  body
}`;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function PortableTextRenderer({ blocks }: { blocks: PortableTextBlock[] }) {
  return (
    <div className='prose-content'>
      {blocks.map((block) => {
        if (block._type === 'image' && block.asset) {
          return (
            <img
              key={block._key}
              src={urlFor(block.asset).width(900).url()}
              alt=''
              className='w-full rounded-xl my-8'
            />
          );
        }

        if (block._type !== 'block' || !block.children) return null;

        const text = block.children.map((child) => {
          let content: React.ReactNode = child.text;
          if (child.marks?.includes('strong'))
            content = <strong key={child._key}>{content}</strong>;
          if (child.marks?.includes('em')) content = <em key={child._key}>{content}</em>;
          if (child.marks?.includes('code'))
            content = (
              <code key={child._key} className='bg-[#F2F3F4] px-1 rounded text-sm font-mono'>
                {content}
              </code>
            );
          return content;
        });

        switch (block.style) {
          case 'h1':
            return (
              <h1
                key={block._key}
                className='platypi-gf text-[#23323F] text-3xl font-semibold mt-10 mb-4 leading-tight'
              >
                {text}
              </h1>
            );
          case 'h2':
            return (
              <h2
                key={block._key}
                className='platypi-gf text-[#23323F] text-2xl font-semibold mt-8 mb-3 leading-tight'
              >
                {text}
              </h2>
            );
          case 'h3':
            return (
              <h3
                key={block._key}
                className='platypi-gf text-[#23323F] text-xl font-semibold mt-6 mb-2'
              >
                {text}
              </h3>
            );
          case 'blockquote':
            return (
              <blockquote
                key={block._key}
                className='border-l-4 border-[#178A2D] pl-5 my-6 text-[#627587] italic text-base leading-7'
              >
                {text}
              </blockquote>
            );
          default:
            return (
              <p key={block._key} className='text-[#23323F] text-base leading-7 my-4'>
                {text}
              </p>
            );
        }
      })}
    </div>
  );
}

function NewsPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    client
      .fetch<Post>(POST_QUERY, { slug })
      .then((data) => {
        if (!data) setNotFound(true);
        else setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className='min-h-screen bg-white'>
      <div className='container max-md:px-5'>
        <Nav />
      </div>

      {loading && (
        <div className='flex justify-center items-center py-40'>
          <div className='w-8 h-8 border-4 border-[#178A2D] border-t-transparent rounded-full animate-spin' />
        </div>
      )}

      {notFound && !loading && (
        <div className='flex flex-col items-center justify-center py-40 px-5 text-center'>
          <p className='text-[#627587] text-lg mb-6'>Post not found.</p>
          <Link
            to='/news'
            className='bg-[#178A2D] text-white text-sm font-semibold px-5 py-2 rounded hover:bg-[#146625] transition-colors'
          >
            ← Back to News
          </Link>
        </div>
      )}

      {post && !loading && (
        <>
          {/* Hero */}
          <div className='bg-[#101611] pt-16 pb-12 px-5'>
            <div className='max-w-[760px] mx-auto'>
              <Link
                to='/news'
                className='inline-flex items-center gap-1 text-[#178A2D] text-sm font-semibold mb-6 hover:underline'
              >
                ← Back to News
              </Link>

              {post.categories && post.categories.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-4'>
                  {post.categories.map((cat) => (
                    <span
                      key={cat.title}
                      className='text-xs font-semibold tracking-[2px] uppercase text-[#178A2D] bg-[#ACFAAC] px-2 py-[2px] rounded'
                    >
                      {cat.title}
                    </span>
                  ))}
                </div>
              )}

              <h1 className='platypi-gf text-[#F2F9FF] text-3xl md:text-[44px] font-semibold leading-tight tracking-tight'>
                {post.title}
              </h1>

              {post.excerpt && (
                <p className='text-[#B0C5D6] text-base leading-[26px] mt-4'>{post.excerpt}</p>
              )}

              <div className='flex items-center gap-4 mt-6 pt-6 border-t border-[#1e2b1f]'>
                {post.author && (
                  <div className='flex items-center gap-2'>
                    {post.author.image ? (
                      <img
                        src={urlFor(post.author.image).width(40).height(40).url()}
                        alt={post.author.name}
                        className='w-10 h-10 rounded-full object-cover'
                      />
                    ) : (
                      <div className='w-10 h-10 rounded-full bg-[#178A2D] flex items-center justify-center'>
                        <span className='text-white text-sm font-semibold'>
                          {post.author.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className='text-[#B0C5D6] text-sm font-medium'>{post.author.name}</span>
                  </div>
                )}
                {post.publishedAt && (
                  <span className='text-[#627587] text-sm'>{formatDate(post.publishedAt)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Cover image */}
          {post.mainImage && (
            <div className='w-full max-w-[900px] mx-auto px-5 -mt-2'>
              <img
                src={urlFor(post.mainImage).width(900).height(500).url()}
                alt={post.title}
                className='w-full h-[260px] md:h-[460px] object-cover rounded-b-2xl'
              />
            </div>
          )}

          {/* Body */}
          <article className='max-w-[760px] mx-auto px-5 py-12 md:py-16'>
            {post.body && <PortableTextRenderer blocks={post.body} />}
          </article>
        </>
      )}

      <Footer />
    </div>
  );
}

export default NewsPostPage;
