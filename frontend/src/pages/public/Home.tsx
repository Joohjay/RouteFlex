import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Shield, Truck, MapPin, Award, Star, ChevronRight, Package, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { SectionHeader } from '@/components/common/SectionHeader';
import { StatsCard, ScrollIndicator, FeatureIcon } from '@/components/premium';
const serviceImages: Record<string, string> = {
  'local-freight': images.services.freight,
  'long-haul-transport': images.services.express,
  'heavy-haul': images.services.heavyHaul,
  'refrigerated-transport': images.services.warehousing,
  'international-freight': images.services.international,
  'courier': images.services.courier,
};

const fleetImages: Record<string, readonly string[]> = {
  VAN: images.fleet.van,
  TRUCK: images.fleet.truck,
  TRAILER: images.fleet.trailer,
  FLATBED: images.fleet.flatbed,
  REFRIGERATED: images.fleet.refrigerated,
  HEAVY: images.fleet.heavy,
};
import { usePublicServices, usePublicFleet, usePublicTestimonials, usePublicBlogPosts } from '@/hooks/usePublicData';
import { AnimatedSection, AnimatedCard, AnimatedGrid, AnimatedHero, AnimatedHeroItem, ParallaxBackground } from '@/animations';
import { images } from '@/lib/images';
import { SEO } from '@/components/seo/SEO';
import { HeroCinematic } from '@/animations/cinematic';

const heroGlowVariants = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.08, 0.12, 0.08],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

const features = [
  {
    icon: Truck,
    title: 'Modern Fleet',
    description: 'Well-maintained vehicles ranging from vans to heavy-duty trucks for every cargo need.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description: 'Reliable scheduling and real-time tracking to keep your supply chain moving.',
  },
  {
    icon: Shield,
    title: 'Safe & Insured',
    description: 'Comprehensive insurance coverage and trained drivers for secure transport.',
  },
  {
    icon: MapPin,
    title: 'Nationwide Coverage',
    description: 'Local and long-haul routes connecting cities and industries across the region.',
  },
];

const stats = [
  { value: '5+', label: 'Years Experience', icon: Award },
  { value: '200+', label: 'Deliveries Completed', icon: Package },
  { value: '150+', label: 'Business Clients', icon: Star },
  { value: '98%', label: 'On-Time Rate', icon: TrendingUp },
];

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "JJ Transport",
  "url": "https://routeflex.vercel.app",
  "description": "Premium freight and logistics solutions for businesses of all sizes across Tanzania and East Africa.",
  "foundingDate": "2018",
  "areaServed": ["Tanzania", "East Africa"],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+255-685-959-574",
    "contactType": "customer service"
  }
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { data: services, isLoading: servicesLoading } = usePublicServices();
  const { data: fleet, isLoading: fleetLoading } = usePublicFleet();
  const { data: testimonials, isLoading: testimonialsLoading } = usePublicTestimonials();
  const { data: blogPosts } = usePublicBlogPosts();

  return (
    <>
      <SEO
        title="Home"
        description="Premium freight and logistics solutions across Tanzania and East Africa. Book transport, track shipments, and get quotes online — from local deliveries to heavy haul."
        canonical="/"
        jsonLd={organizationJsonLd}
      />
      {/* ─── Hero ─── */}
      <HeroCinematic containerRef={heroRef}>
      <section ref={heroRef} className="relative min-h-[90vh] overflow-hidden" style={{ background: 'linear-gradient(135deg, #163A5F 0%, #204B74 55%, #2A5F90 100%)' }}>
        <ParallaxBackground src={images.hero.main} speed={0.25} className="opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#163A5F]/40 via-[#163A5F]/65 to-[#163A5F]" />
        <motion.div
          variants={heroGlowVariants}
          animate="animate"
          className="absolute left-1/2 top-1/4 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C29A4A]/10 blur-3xl"
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#163A5F] to-transparent" />

        <div className="relative mx-auto flex min-h-[90vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <AnimatedHero className="max-w-3xl">
              <AnimatedHeroItem>
                <div data-cinematic-hero className="inline-flex items-center gap-2 rounded-full border border-[#C29A4A]/20 bg-[#C29A4A]/10 px-4 py-1.5 text-sm font-medium text-[#C29A4A] backdrop-blur-sm">
                  <Award size={14} />
                  Trusted Logistics Partner
                </div>
              </AnimatedHeroItem>
              <AnimatedHeroItem>
                <h1 data-cinematic-hero className="mt-8 text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl font-heading">
                  Freight & Logistics
                  <br />
                  <span className="bg-gradient-to-b from-white via-[#F5F2EB] to-[#D8B46A] bg-clip-text text-transparent">
                    That Moves Business
                  </span>
                </h1>
              </AnimatedHeroItem>
              <AnimatedHeroItem>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-400">
                  Reliable transport, real-time tracking, and transparent pricing. From local deliveries
                  to heavy haul — we deliver with precision and care.
                </p>
              </AnimatedHeroItem>
              <AnimatedHeroItem>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-[#C29A4A] text-[#163A5F] hover:bg-[#B8863A] shadow-lg shadow-[#C29A4A]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#C29A4A]/30 hover:-translate-y-0.5">
                    <Link to="/book">
                      Get a Quote
                      <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:border-white/40">
                    <Link to="/services">Explore Services</Link>
                  </Button>
                </div>
              </AnimatedHeroItem>
            </AnimatedHero>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:grid-cols-4 lg:mt-20 lg:p-8"
            >
              {stats.map((stat) => (
                <StatsCard
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                  className="border-0 bg-white/5 text-white shadow-none backdrop-blur-sm"
                />
              ))}
            </motion.div>
          </div>
        </div>

        <ScrollIndicator />
      </section>
      </HeroCinematic>

      {/* ─── Why Choose Us ─── */}
      <AnimatedSection className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Businesses Choose JJ Transport"
            subtitle="We combine technology, expertise, and a customer-first approach to deliver exceptional logistics services."
            centered
          />
          <AnimatedGrid className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <AnimatedCard key={feature.title} className="group h-full">
                  <Card className="h-full border-0 bg-gradient-to-b from-gray-50 to-white shadow-sm dark:from-gray-900 dark:to-gray-950">
                    <CardContent className="p-6">
                      <FeatureIcon icon={Icon} />
                      <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              );
            })}
          </AnimatedGrid>
        </div>
      </AnimatedSection>

      {/* ─── Services ─── */}
      <AnimatedSection className="bg-gray-50 py-24 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Services"
            subtitle="Comprehensive transport and logistics solutions tailored to your industry."
            centered
          />
          {servicesLoading ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          ) : (
            <AnimatedGrid className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(services ?? []).slice(0, 4).map((service, i) => (
                <AnimatedCard key={service.id} index={i} className="group h-full">
                  <Link to={`/services/${service.slug}`} className="block h-full">
                    <Card className="h-full overflow-hidden border-0 shadow-sm transition-shadow hover:shadow-md">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={service.imageUrl || serviceImages[service.slug] || images.services.logistics}
                          alt={service.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold">{service.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                          {service.summary ?? service.description}
                        </p>
                        <span className="mt-4 inline-flex items-center text-sm font-medium text-[#C29A4A]">
                          Learn more <ChevronRight size={16} className="ml-0.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedCard>
              ))}
            </AnimatedGrid>
          )}
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="group">
              <Link to="/services">
                View All Services
                <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* ─── Fleet ─── */}
      <AnimatedSection className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Fleet"
            subtitle="A diverse fleet of vehicles ready to handle any cargo requirement."
            centered
          />
          {fleetLoading ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          ) : (
            <AnimatedGrid className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(fleet ?? []).slice(0, 4).map((vehicle, i) => (
                <AnimatedCard key={vehicle.id} index={i} className="group h-full">
                  <Card className="h-full overflow-hidden border-0 shadow-sm transition-shadow hover:shadow-md">
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={vehicle.images?.[0]?.url || vehicle.id ? (fleetImages[vehicle.type]?.[vehicle.id.charCodeAt(0) % 5] ?? images.fleet.truck[0]) : images.fleet.truck[0]}
                        alt={vehicle.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                        <span className="rounded-full bg-[#C29A4A]/10 px-2.5 py-0.5 text-xs font-medium text-[#C29A4A]">
                          {(vehicle.capacityKg / 1000).toFixed(0)}T
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{vehicle.description}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${vehicle.status === 'ACTIVE' ? 'bg-green-500' : vehicle.status === 'MAINTENANCE' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {vehicle.status === 'ACTIVE' ? 'Available' : vehicle.status === 'MAINTENANCE' ? 'In Maintenance' : 'Out of Service'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </AnimatedGrid>
          )}
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="group">
              <Link to="/fleet">
                View Full Fleet
                <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* ─── Testimonials ─── */}
      <AnimatedSection className="bg-gray-50 py-24 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="What Our Clients Say"
            subtitle="Trusted by businesses across industries for reliable logistics support."
            centered
          />
          {testimonialsLoading ? (
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          ) : (
            <AnimatedGrid className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(testimonials ?? []).slice(0, 3).map((testimonial, i) => (
                <AnimatedCard key={testimonial.id} index={i} className="h-full">
                  <Card className="relative h-full border-0 bg-white shadow-sm dark:bg-gray-900">
                    <div className="absolute right-6 top-6 text-5xl font-serif text-[#C29A4A]/20 leading-none">&ldquo;</div>
                    <CardContent className="p-6">
                      <div className="flex gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} size={16} className="fill-[#C29A4A] text-[#C29A4A]" />
                        ))}
                      </div>
                      <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">&ldquo;{testimonial.content}&rdquo;</p>
                      <div className="mt-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C29A4A]/10 text-sm font-bold text-[#C29A4A]">
                          {testimonial.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{testimonial.author}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </AnimatedGrid>
          )}
        </div>
      </AnimatedSection>

      {/* ─── Blog ─── */}
      {blogPosts?.data && blogPosts.data.length > 0 && (
        <AnimatedSection className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Latest from Our Blog"
              subtitle="Insights, updates, and stories from the world of logistics."
              centered
            />
            <AnimatedGrid className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.data.slice(0, 3).map((post, i) => (
                <AnimatedCard key={post.id} index={i} className="group h-full">
                  <Link to={`/blog/${post.slug}`} className="block h-full">
                    <Card className="h-full overflow-hidden border-0 shadow-sm transition-shadow hover:shadow-md">
                      {post.coverImage && (
                        <div className="relative h-48 overflow-hidden">
                          <img src={post.coverImage} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          {post.publishedAt && (
                            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          )}
                          {post.tags && post.tags.length > 0 && (
                            <>
                              <span>&bull;</span>
                              <span>{post.tags[0]}</span>
                            </>
                          )}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold leading-snug">{post.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{post.excerpt ?? post.content}</p>
                        <span className="mt-4 inline-flex items-center text-sm font-medium text-[#C29A4A]">
                          Read more <ChevronRight size={16} className="ml-0.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedCard>
              ))}
            </AnimatedGrid>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" className="group">
                <Link to="/blog">
                  View All Posts
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ─── CTA ─── */}
      <AnimatedSection className="relative overflow-hidden py-24" style={{ background: 'linear-gradient(135deg, #163A5F 0%, #204B74 55%, #2A5F90 100%)' }}>
        <div className="absolute inset-0">
          <img src={images.cta.background} alt="" loading="lazy" className="h-full w-full object-cover opacity-20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#163A5F]/90 to-[#163A5F]/70" />
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C29A4A]/5 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C29A4A]/20 bg-[#C29A4A]/10 px-4 py-1.5 text-sm font-medium text-[#C29A4A]">
              <Award size={14} />
              Ready to Get Started?
            </div>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl font-heading">
              Ready to Move Your Cargo?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
              Get an instant estimate and book your transport in minutes. Our team is ready to help.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-[#C29A4A] text-[#163A5F] hover:bg-[#B8863A]">
                <Link to="/book">
                  Book Transport
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/track">Track Shipment</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  );
}
