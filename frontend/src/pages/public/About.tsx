import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users, Award, Truck, Package, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { SectionHeader } from '@/components/common/SectionHeader';
import { AnimatedSection, AnimatedCard, AnimatedGrid, AnimatedHero, AnimatedHeroItem } from '@/animations';
import { images } from '@/lib/images';

const values = [
  {
    icon: Target,
    title: 'Mission',
    description:
      'To provide reliable, efficient, and safe transport solutions that empower businesses to grow and communities to thrive.',
  },
  {
    icon: Eye,
    title: 'Vision',
    description:
      'To become the most trusted logistics partner in the region through innovation, integrity, and exceptional service.',
  },
  {
    icon: Heart,
    title: 'Values',
    description:
      'Safety, punctuality, transparency, and customer satisfaction guide every decision we make.',
  },
  {
    icon: Users,
    title: 'Our Team',
    description:
      'Experienced drivers, dispatchers, and logistics professionals dedicated to your success.',
  },
];

const milestones = [
  { value: '15+', label: 'Years in Business', icon: Award },
  { value: '50+', label: 'Fleet Vehicles', icon: Truck },
  { value: '10K+', label: 'Deliveries', icon: Package },
  { value: '98%', label: 'Satisfaction', icon: Star },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | JJ Transport</title>
        <meta name="description" content="Learn about JJ Transport's history, mission, and the team behind our logistics services." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0e1a] py-28 lg:py-36">
        <div className="absolute inset-0">
          <img src={images.about.facility} alt="" className="h-full w-full object-cover opacity-30" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/70 to-[#0a0e1a]" />
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b]/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHero className="mx-auto max-w-3xl text-center">
            <AnimatedHeroItem>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-4 py-1.5 text-sm font-medium text-[#f59e0b]">
                <Award size={14} />
                Our Story
              </div>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                About JJ Transport
              </h1>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
                A leading logistics company committed to moving goods safely, on time, and with complete transparency.
              </p>
            </AnimatedHeroItem>
          </AnimatedHero>
        </div>
      </section>

      {/* Story */}
      <AnimatedSection className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-extrabold tracking-tight">Delivering Excellence Since Day One</h2>
              <p className="mt-4 leading-relaxed text-gray-500 dark:text-gray-400">
                JJ Transport began with a simple mission: to make freight and cargo transport reliable,
                transparent, and accessible. Over the years, we have grown into a full-service logistics
                provider serving businesses across multiple industries.
              </p>
              <p className="mt-4 leading-relaxed text-gray-500 dark:text-gray-400">
                From small parcels to heavy machinery, our diverse fleet and experienced team handle every
                shipment with care. We invest in technology to provide real-time tracking, accurate
                estimates, and seamless communication.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <img src={images.about.facility} alt="Our facility" className="w-full rounded-2xl" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Milestones */}
      <AnimatedSection className="bg-[#0a0e1a] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur"
                >
                  <Icon size={28} className="mx-auto text-[#f59e0b]" />
                  <div className="mt-3 text-3xl font-extrabold text-white">{m.value}</div>
                  <div className="mt-1 text-sm text-gray-400">{m.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Values */}
      <AnimatedSection className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="What Drives Us" subtitle="Our core principles define every delivery." centered />
          <AnimatedGrid className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <AnimatedCard key={value.title} index={i} className="h-full">
                  <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-950">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f59e0b]/10 text-[#f59e0b]">
                      <Icon size={24} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{value.description}</p>
                  </div>
                </AnimatedCard>
              );
            })}
          </AnimatedGrid>
        </div>
      </AnimatedSection>

      {/* Team image */}
      <AnimatedSection className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl">
            <img src={images.about.team} alt="Our team" className="w-full object-cover" style={{ maxHeight: '400px' }} />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-8">
              <div>
                <h3 className="text-2xl font-bold text-white">Meet Our Team</h3>
                <p className="mt-1 text-gray-200">Experienced professionals dedicated to your cargo.</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
