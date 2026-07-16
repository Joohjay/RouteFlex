import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Shield, Truck, MapPin, Award, Star, ChevronRight, Package, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { SectionHeader } from '@/components/common/SectionHeader';
import { StatsCard, ScrollIndicator, FeatureIcon } from '@/components/premium';
import { usePublicServices, usePublicFleet, usePublicTestimonials, usePublicBlogPosts } from '@/hooks/usePublicData';
import { AnimatedSection, AnimatedCard, AnimatedGrid, AnimatedHero, AnimatedHeroItem, ParallaxBackground } from '@/animations';
import { images } from '@/lib/images';

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
  { value: '15+', label: 'Years Experience', icon: Award },
  { value: '10K+', label: 'Deliveries Completed', icon: Package },
  { value: '500+', label: 'Business Clients', icon: Star },
  { value: '98%', label: 'On-Time Rate', icon: TrendingUp },
];

export default function Home() {
  const { data: services, isLoading: servicesLoading } = usePublicServices();
  const { data: fleet, isLoading: fleetLoading } = usePublicFleet();
  const { data: testimonials, isLoading: testimonialsLoading } = usePublicTestimonials();
  const { data: blogPosts } = usePublicBlogPosts();

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative min-h-[90vh] overflow-hidden bg-[#0a0e1a]">
        <ParallaxBackground src={images.hero.main} speed={0.25} className="opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/50 via-[#0a0e1a]/75 to-[#0a0e1a]" />
        <motion.div
          variants={heroGlowVariants}
          animate="animate"
          className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b] blur-3xl"
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0e1a] to-transparent" />

        <div className="relative mx-auto flex min-h-[90vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <AnimatedHero className="max-w-3xl">
              <AnimatedHeroItem>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-4 py-1.5 text-sm font-medium text-[#f59e0b] backdrop-blur-sm">
                  <Award size={14} />
                  Trusted Logistics Partner
                </div>
              </AnimatedHeroItem>
              <AnimatedHeroItem>
                <h1 className="mt-8 text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Freight & Logistics
                  <br />
                  <span className="bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
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
                  <Button asChild size="lg" className="bg-[#f59e0b] text-[#0a0e1a] hover:bg-[#d97706] shadow-lg shadow-[#f59e0b]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#f59e0b]/30 hover:-translate-y-0.5">
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
                      {service.imageUrl ? (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={service.imageUrl}
                            alt={service.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                      ) : (
                        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[#f59e0b]/5 to-[#0a0e1a]/5">
                          <Truck size={48} className="text-[#f59e0b]/30" />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold">{service.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                          {service.summary ?? service.description}
                        </p>
                        <span className="mt-4 inline-flex items-center text-sm font-medium text-[#f59e0b]">
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
                  <Card className="h-full border-0 bg-gradient-to-b from-gray-50 to-white shadow-sm dark:from-gray-900 dark:to-gray-950">
                    <CardContent className="p-6">
                      {vehicle.images?.[0]?.url ? (
                        <div className="relative mb-4 h-36 overflow-hidden rounded-lg">
                          <img src={vehicle.images[0].url} alt={vehicle.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      ) : (
                        <div className="mb-4 flex h-36 items-center justify-center rounded-lg bg-gradient-to-br from-[#f59e0b]/5 to-[#0a0e1a]/5">
                          <Truck size={40} className="text-[#f59e0b]/30" />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                        <span className="rounded-full bg-[#f59e0b]/10 px-2.5 py-0.5 text-xs font-medium text-[#f59e0b]">
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
                    <div className="absolute right-6 top-6 text-5xl font-serif text-[#f59e0b]/20 leading-none">&ldquo;</div>
                    <CardContent className="p-6">
                      <div className="flex gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} size={16} className="fill-[#f59e0b] text-[#f59e0b]" />
                        ))}
                      </div>
                      <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">&ldquo;{testimonial.content}&rdquo;</p>
                      <div className="mt-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f59e0b]/10 text-sm font-bold text-[#f59e0b]">
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
                          <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                        <span className="mt-4 inline-flex items-center text-sm font-medium text-[#f59e0b]">
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
      <AnimatedSection className="relative overflow-hidden bg-[#0a0e1a] py-24">
        <div className="absolute inset-0">
          <img src={images.cta.background} alt="" className="h-full w-full object-cover opacity-30" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/90 to-[#0a0e1a]/70" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b]/5 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-4 py-1.5 text-sm font-medium text-[#f59e0b]">
              <Award size={14} />
              Ready to Get Started?
            </div>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Ready to Move Your Cargo?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
              Get an instant estimate and book your transport in minutes. Our team is ready to help.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-[#f59e0b] text-[#0a0e1a] hover:bg-[#d97706]">
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
