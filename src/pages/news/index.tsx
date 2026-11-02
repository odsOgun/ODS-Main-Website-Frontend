import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '@/components/local/nav';
import Footer from '@/components/local/footer';
import { client, urlFor, type Post } from '@/lib/sanity';

const ALL_POSTS_QUERY = `*[_type == "post"] | order(featured desc, publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  featured,
  categories[]->{ title },
  author->{ name, image }
}`;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function FeaturedPostCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/news/${post.slug.current}`}
      className='group grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden bg-white border border-[#E5EAE6] hover:shadow-xl transition-shadow duration-300'
    >
      {/* Image */}
      <div className='w-full h-[280px] md:h-[420px] bg-[#E5EAE6] overflow-hidden'>
        {post.mainImage ? (
          <img
            src={urlFor(post.mainImage).width(900).height(640).url()}
            alt={post.title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-[#0E140F]'>
            <span className='text-[#627587] text-sm'>No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex flex-col justify-between p-8 md:p-10'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-3 flex-wrap'>
            <span className='text-xs font-bold tracking-[2px] uppercase text-white bg-[#FA6C20] px-3 py-1 rounded-full'>
              Featured
            </span>
            {post.categories &&
              post.categories.length > 0 &&
              post.categories.map((cat) => (
                <span
                  key={cat.title}
                  className='text-xs font-semibold tracking-[2px] uppercase text-[#178A2D] bg-[#ACFAAC] px-2 py-[2px] rounded'
                >
                  {cat.title}
                </span>
              ))}
          </div>

          <h2 className='platypi-gf text-[#101611] font-semibold text-2xl md:text-3xl leading-tight group-hover:text-[#178A2D] transition-colors'>
            {post.title}
          </h2>

          {post.excerpt && (
            <p className='text-[#627587] text-sm md:text-base leading-[26px] line-clamp-4'>
              {post.excerpt}
            </p>
          )}
        </div>

        <div className='flex items-center justify-between pt-6 border-t border-[#E5EAE6] mt-6'>
          {post.author && (
            <div className='flex items-center gap-3'>
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
              <span className='text-[#23323F] text-sm font-medium'>{post.author.name}</span>
            </div>
          )}
          {post.publishedAt && (
            <span className='text-[#627587] text-sm'>{formatDate(post.publishedAt)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/news/${post.slug.current}`}
      className='group flex flex-col rounded-2xl overflow-hidden bg-white border border-[#E5EAE6] hover:shadow-lg transition-shadow duration-300'
    >
      <div className='w-full h-[220px] bg-[#E5EAE6] overflow-hidden'>
        {post.mainImage ? (
          <img
            src={urlFor(post.mainImage).width(600).height(440).url()}
            alt={post.title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-[#0E140F]'>
            <span className='text-[#627587] text-sm'>No image</span>
          </div>
        )}
      </div>

      <div className='flex flex-col flex-1 p-5 gap-3'>
        {post.categories && post.categories.length > 0 && (
          <div className='flex flex-wrap gap-2'>
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

        <h2 className='text-[#23323F] font-semibold text-lg leading-6 group-hover:text-[#178A2D] transition-colors'>
          {post.title}
        </h2>

        {post.excerpt && (
          <p className='text-[#627587] text-sm leading-[22px] line-clamp-3'>{post.excerpt}</p>
        )}

        <div className='mt-auto flex items-center justify-between pt-3 border-t border-[#E5EAE6]'>
          {post.author && (
            <div className='flex items-center gap-2'>
              {post.author.image ? (
                <img
                  src={urlFor(post.author.image).width(32).height(32).url()}
                  alt={post.author.name}
                  className='w-8 h-8 rounded-full object-cover'
                />
              ) : (
                <div className='w-8 h-8 rounded-full bg-[#178A2D] flex items-center justify-center'>
                  <span className='text-white text-xs font-semibold'>
                    {post.author.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className='text-[#627587] text-xs font-medium'>{post.author.name}</span>
            </div>
          )}
          {post.publishedAt && (
            <span className='text-[#627587] text-xs'>{formatDate(post.publishedAt)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    client
      .fetch<Post[]>(ALL_POSTS_QUERY)
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const featuredPost = posts.find((p) => p.featured);
  const otherPosts = posts.filter((p) => !p.featured);

  return (
    <div className='min-h-screen bg-white'>
      <div className='container max-md:px-5'>
        <Nav />
      </div>

      {/* Hero */}
      <div className='bg-[#101611] pt-20 pb-16 px-5'>
        <div className='max-w-[1120px] mx-auto'>
          <p className='text-xs font-semibold tracking-[3px] uppercase text-[#178A2D] mb-4'>
            ODS News
          </p>
          <h1 className='platypi-gf text-[#F2F9FF] text-3xl md:text-5xl font-semibold leading-tight tracking-tight max-w-[600px]'>
            Latest News & Updates
          </h1>
          <p className='text-[#B0C5D6] text-sm md:text-base leading-[22px] mt-4 max-w-[520px]'>
            Stay up to date with announcements, recaps, and insights from the Ogun Digital Summit
            community.
          </p>
        </div>
      </div>

      <div className='max-w-[1120px] mx-auto px-8 xl:box-content py-16'>
        {loading && (
          <div className='flex justify-center items-center py-20'>
            <div className='w-8 h-8 border-4 border-[#178A2D] border-t-transparent rounded-full animate-spin' />
          </div>
        )}

        {error && (
          <div className='text-center py-20'>
            <p className='text-[#627587]'>Failed to load posts. Please try again later.</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className='text-center py-20'>
            <p className='text-[#627587] text-base'>No posts published yet. Check back soon.</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className='flex flex-col gap-12'>
            {/* Featured post */}
            {featuredPost && (
              <div>
                <p className='text-xs font-semibold tracking-[3px] uppercase text-[#627587] mb-5'>
                  Featured Story
                </p>
                <FeaturedPostCard post={featuredPost} />
              </div>
            )}

            {/* Rest of posts */}
            {otherPosts.length > 0 && (
              <div>
                {featuredPost && (
                  <p className='text-xs font-semibold tracking-[3px] uppercase text-[#627587] mb-5'>
                    More Stories
                  </p>
                )}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {otherPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default NewsPage;
