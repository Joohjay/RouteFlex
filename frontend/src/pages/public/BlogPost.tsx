import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/common/Loading';
import { usePublicBlogPost } from '@/hooks/usePublicData';
import { formatDate } from '@/lib/utils';
import { SEO } from '@/components/seo/SEO';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = usePublicBlogPost(slug ?? '');

  if (isLoading) {
    return <Loading className="min-h-[60vh]" />;
  }

  if (!post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Blog Post Not Found</h1>
        <Button asChild className="mt-4">
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <SEO title={post?.title ?? 'Blog Post'} description={post?.excerpt ?? post?.content?.substring(0, 160) ?? 'Read this article from JJ Transport.'} canonical={`/blog/${slug}`} />
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/blog" className="inline-flex items-center text-brand-100 hover:text-white">
              <ArrowLeft size={16} className="mr-1" /> All Articles
            </Link>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">{post.title}</h1>
            <div className="mt-4 flex items-center gap-2 text-brand-100">
              <Calendar size={16} />
              {post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} loading="lazy" className="mb-8 w-full rounded-2xl object-cover" />
          )}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            <div className="mt-6 whitespace-pre-line">{post.content}</div>
          </div>
        </div>
      </section>
    </>
  );
}
