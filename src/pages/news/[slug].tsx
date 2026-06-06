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

const COMMENTS_QUERY = `*[_type == "comment" && post._ref == $postId && approved == true] | order(createdAt asc) {
  _id,
  name,
  comment,
  createdAt
}`;

interface Comment {
  _id: string;
  name: string;
  comment: string;
  createdAt: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// ─── Portable Text Renderer ───────────────────────────────────────────────────
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

// ─── Comment Form ─────────────────────────────────────────────────────────────
function CommentForm({ postId }: { postId: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, comment, postId })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Something went wrong.');
        setStatus('error');
      } else {
        setStatus('success');
        setName('');
        setEmail('');
        setComment('');
      }
    } catch {
      setErrorMsg('Failed to submit. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className='bg-[#EDFEE5] border border-[#ACFAAC] rounded-xl p-6 text-center'>
        <p className='text-[#178A2D] font-semibold text-base mb-1'>Comment submitted!</p>
        <p className='text-[#627587] text-sm'>It will appear after approval. Thank you!</p>
        <button
          onClick={() => setStatus('idle')}
          className='mt-4 text-sm text-[#178A2D] font-semibold underline'
        >
          Leave another comment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex flex-col gap-1 flex-1'>
          <label className='text-sm font-semibold text-[#23323F]'>
            Name <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Your name'
            className='border border-[#E5EAE6] rounded-lg px-4 py-3 text-sm text-[#23323F] placeholder:text-[#B0C5D6] focus:outline-none focus:border-[#178A2D] transition-colors'
          />
        </div>
        <div className='flex flex-col gap-1 flex-1'>
          <label className='text-sm font-semibold text-[#23323F]'>
            Email <span className='text-[#B0C5D6] font-normal'>(optional)</span>
          </label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='your@email.com'
            className='border border-[#E5EAE6] rounded-lg px-4 py-3 text-sm text-[#23323F] placeholder:text-[#B0C5D6] focus:outline-none focus:border-[#178A2D] transition-colors'
          />
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <label className='text-sm font-semibold text-[#23323F]'>
          Comment <span className='text-red-500'>*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={5}
          placeholder='Share your thoughts…'
          maxLength={1000}
          className='border border-[#E5EAE6] rounded-lg px-4 py-3 text-sm text-[#23323F] placeholder:text-[#B0C5D6] focus:outline-none focus:border-[#178A2D] transition-colors resize-none'
        />
        <p className='text-xs text-[#B0C5D6] text-right'>{comment.length}/1000</p>
      </div>

      {status === 'error' && (
        <p className='text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2'>{errorMsg}</p>
      )}

      <button
        type='submit'
        disabled={status === 'submitting'}
        className='bg-[#178A2D] text-white font-semibold text-sm h-11 rounded-lg flex items-center justify-center gap-2 hover:bg-[#146625] transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full md:w-auto md:min-w-[160px]'
      >
        {status === 'submitting' ? (
          <>
            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
            Submitting…
          </>
        ) : (
          'Post Comment'
        )}
      </button>

      <p className='text-xs text-[#B0C5D6]'>Comments are reviewed before appearing publicly.</p>
    </form>
  );
}

// ─── Comments List ────────────────────────────────────────────────────────────
function CommentsList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch<Comment[]>(COMMENTS_QUERY, { postId })
      .then((data) => {
        setComments(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [postId]);

  if (loading) {
    return (
      <div className='flex justify-center py-8'>
        <div className='w-6 h-6 border-2 border-[#178A2D] border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <p className='text-[#627587] text-sm py-4'>
        No comments yet. Be the first to share your thoughts!
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-5'>
      {comments.map((c) => (
        <div key={c._id} className='bg-[#F7F9F7] rounded-xl p-5 border border-[#E5EAE6]'>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 rounded-full bg-[#178A2D] flex items-center justify-center flex-shrink-0'>
                <span className='text-white text-xs font-semibold'>
                  {c.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className='text-sm font-semibold text-[#23323F]'>{c.name}</span>
            </div>
            <span className='text-xs text-[#B0C5D6]'>{formatDateTime(c.createdAt)}</span>
          </div>
          <p className='text-sm text-[#23323F] leading-6 pl-10'>{c.comment}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
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

          {/* Comments section */}
          <section className='max-w-[760px] mx-auto px-5 pb-16'>
            <div className='border-t border-[#E5EAE6] pt-12'>
              {/* Existing comments */}
              <h2 className='platypi-gf text-[#23323F] text-2xl font-semibold mb-8'>Comments</h2>
              <CommentsList postId={post._id} />

              {/* Comment form */}
              <div className='mt-12'>
                <h3 className='platypi-gf text-[#23323F] text-xl font-semibold mb-6'>
                  Leave a comment
                </h3>
                <CommentForm postId={post._id} />
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}

export default NewsPostPage;
