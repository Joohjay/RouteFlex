import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, Calendar, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePublicBlogPosts } from '@/hooks/usePublicData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { AnimatedSection, AnimatedCard, AnimatedGrid, AnimatedHero, AnimatedHeroItem } from '@/animations';
import { images } from '@/lib/images';
import type { BlogPost } from '@/types';

const POSTS_PER_PAGE = 6;

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/blog/${post.slug}`} className="group block">
        <Card className="overflow-hidden border-0 shadow-sm transition-shadow hover:shadow-md">
          <div className="grid md:grid-cols-2">
            <div className="relative h-64 overflow-hidden md:h-full">
              <img src={post.coverImage || images.blog.coverDefault} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <CardContent className="flex flex-col justify-center p-8">
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                {post.publishedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={13} />
                      {post.tags[0]}
                    </span>
                  </>
                )}
              </div>
              <h2 className="mt-3 text-2xl font-bold leading-snug md:text-3xl">{post.title}</h2>
              <p className="mt-3 line-clamp-3 text-gray-500 dark:text-gray-400">{post.excerpt ?? post.content}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#C29A4A]">
                Read Article
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </CardContent>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <AnimatedCard index={index} className="group h-full">
      <Link to={`/blog/${post.slug}`} className="block h-full">
        <Card className="h-full overflow-hidden border-0 bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-950">
          <div className="relative h-48 overflow-hidden">
            <img src={post.coverImage || images.blog.coverDefault} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              {post.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
              {post.tags && post.tags.length > 0 && (
                <>
                  <span>&bull;</span>
                  <span>{post.tags[0]}</span>
                </>
              )}
            </div>
            <h3 className="mt-2 text-lg font-bold leading-snug">{post.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {post.excerpt ?? post.content}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#C29A4A]">
              Read more
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </CardContent>
        </Card>
      </Link>
    </AnimatedCard>
  );
}

export default function Blog() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data: blogData, isLoading } = usePublicBlogPosts(page, POSTS_PER_PAGE);

  const posts = blogData?.data ?? [];
  const totalPages = blogData?.meta?.pages ?? 1;
  const totalPosts = blogData?.meta?.total ?? 0;

  const featured = posts[0];

  const filtered = useMemo(() => {
    if (!search) return posts;
    const q = search.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [posts, search]);

  const remaining = search ? filtered : filtered.slice(1);

  return (
    <>
      <Helmet>
        <title>Blog | JJ Transport</title>
        <meta name="description" content="Read the latest insights, updates, and stories from JJ Transport's logistics experts." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden py-28 lg:py-36" style={{ background: 'linear-gradient(135deg, #163A5F 0%, #204B74 55%, #2A5F90 100%)' }}>
        <div className="absolute inset-0">
          <img src={images.blog.coverDefault} alt="" className="h-full w-full object-cover opacity-20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#163A5F]/60 to-[#163A5F]" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C29A4A]/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHero className="mx-auto max-w-3xl text-center">
            <AnimatedHeroItem>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C29A4A]/20 bg-[#C29A4A]/10 px-4 py-1.5 text-sm font-medium text-[#C29A4A]">
                <BookOpen size={14} />
                Insights & Updates
              </div>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl font-heading">
                Our Blog
              </h1>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
                Insights, updates, and stories from the world of logistics and transport.
              </p>
            </AnimatedHeroItem>
          </AnimatedHero>
        </div>
      </section>

      {/* Search */}
      <AnimatedSection className="border-b bg-white py-6 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              {totalPosts > 0 ? `${totalPosts} article${totalPosts > 1 ? 's' : ''}` : 'Loading...'}
            </p>
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Content */}
      <AnimatedSection className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <>
              <div className="h-64 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-72 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
                ))}
              </div>
            </>
          ) : filtered.length > 0 ? (
            <>
              {!search && featured && <FeaturedPost post={featured} />}
              {remaining.length > 0 && (
                <AnimatedGrid className={`grid gap-6 ${!search && featured ? 'mt-10' : ''} md:grid-cols-2 lg:grid-cols-3`}>
                  {remaining.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                  ))}
                </AnimatedGrid>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <Search size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
              <p className="mt-4 text-lg font-medium text-gray-500">No articles found</p>
              {search && (
                <Button variant="outline" className="mt-6" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !search && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          )}
        </div>
      </AnimatedSection>
    </>
  );
}
