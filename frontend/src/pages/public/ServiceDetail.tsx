import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/common/Loading';
import { usePublicServices } from '@/hooks/usePublicData';
import { SEO } from '@/components/seo/SEO';

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: services, isLoading } = usePublicServices();
  const service = services?.find((s) => s.slug === slug);

  if (isLoading) {
    return <Loading className="min-h-[60vh]" />;
  }

  if (!service) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Service Not Found</h1>
        <Button asChild className="mt-4">
          <Link to="/services">Back to Services</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <SEO title={service?.title ?? 'Service Details'} description={service?.summary ?? service?.description ?? 'Learn more about this service from JJ Transport.'} canonical={`/services/${slug}`} />
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to="/services" className="inline-flex items-center text-brand-100 hover:text-white">
              <ArrowLeft size={16} className="mr-1" /> All Services
            </Link>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{service.title}</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {service.imageUrl && (
            <img
              src={service.imageUrl}
              alt={service.title}
              loading="lazy"
              className="mb-8 w-full rounded-2xl object-cover"
            />
          )}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground">{service.summary}</p>
            <div className="mt-6 whitespace-pre-line text-foreground">{service.description}</div>
          </div>
          <div className="mt-10">
            <Button asChild>
              <Link to="/book">
                Request This Service <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
