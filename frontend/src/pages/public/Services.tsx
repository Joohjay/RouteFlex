import { Package, Truck, Snowflake, ArrowRight, Shield, Clock, MapPin, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { usePublicServices } from '@/hooks/usePublicData';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { AnimatedSection, AnimatedCard, AnimatedGrid, AnimatedHero, AnimatedHeroItem } from '@/animations';
import { images } from '@/lib/images';
import type { Service } from '@/types';

const serviceIcons: Record<string, typeof Package> = {
  'local-freight': Package,
  'long-haul-transport': Truck,
  'heavy-haul': Package,
  'refrigerated-transport': Snowflake,
};

const serviceImages: Record<string, string> = {
  'local-freight': images.services.freight,
  'long-haul-transport': images.services.express,
  'heavy-haul': images.services.heavyHaul,
  'refrigerated-transport': images.services.warehousing,
  'international-freight': images.services.international,
  'courier': images.services.courier,
};

const stats = [
  { label: 'Deliveries Completed', value: '10,000+', icon: TrendingUp },
  { label: 'Years in Business', value: '15+', icon: Clock },
  { label: 'Service Locations', value: '50+', icon: MapPin },
  { label: 'Client Retention', value: '98%', icon: Shield },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = serviceIcons[service.slug] ?? Package;
  const imgSrc = service.imageUrl || serviceImages[service.slug] || images.services.logistics;

  return (
    <AnimatedCard index={index} className="group h-full">
      <Link to={`/services/${service.slug}`} className="block h-full">
        <Card className="relative h-full overflow-hidden border-0 bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-950">
          <div className="relative h-44 overflow-hidden">
            <img src={imgSrc} alt={service.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f59e0b] text-white shadow-lg">
              <Icon size={24} />
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {service.summary ?? service.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#f59e0b]">
              Learn more
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </CardContent>
        </Card>
      </Link>
    </AnimatedCard>
  );
}

export default function Services() {
  const { data: services, isLoading } = usePublicServices();

  return (
    <>
      <Helmet>
        <title>Our Services | JJ Transport</title>
        <meta name="description" content="Explore JJ Transport's comprehensive freight and logistics services including local delivery, long haul, refrigerated, and heavy haul transport." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0e1a] py-28 lg:py-36">
        <div className="absolute inset-0">
          <img src={images.services.logistics} alt="" className="h-full w-full object-cover opacity-30" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/70 to-[#0a0e1a]" />
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b]/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHero className="mx-auto max-w-3xl text-center">
            <AnimatedHeroItem>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-4 py-1.5 text-sm font-medium text-[#f59e0b]">
                <Shield size={14} />
                Comprehensive Solutions
              </div>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Our Services
              </h1>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
                Comprehensive logistics solutions tailored to your business needs. From local deliveries to heavy haul, we deliver with precision.
              </p>
            </AnimatedHeroItem>
          </AnimatedHero>
        </div>
      </section>

      {/* Services Grid */}
      <AnimatedSection className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          ) : services && services.length > 0 ? (
            <AnimatedGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
            </AnimatedGrid>
          ) : (
            <div className="py-20 text-center">
              <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
              <p className="mt-4 text-lg text-gray-500">No services available yet.</p>
              <Button asChild className="mt-6">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection className="bg-[#0a0e1a] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur"
                >
                  <StatIcon size={28} className="mx-auto text-[#f59e0b]" />
                  <div className="mt-3 text-3xl font-extrabold text-white">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="relative overflow-hidden bg-gradient-to-br from-[#0a0e1a] to-[#111827] py-20">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b]/5 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-4 py-1.5 text-sm font-medium text-[#f59e0b]">
              <Award size={14} />
              Reliable & Trusted
            </div>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Ready to Move Your Freight?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
              Get an instant quote and book your transport in minutes. Our team is ready to help.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-[#f59e0b] text-[#0a0e1a] hover:bg-[#d97706]">
                <Link to="/book">Get a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  );
}
