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
  { value: '5+', label: 'Years in Business', icon: Award },
  { value: '50+', label: 'Fleet Vehicles', icon: Truck },
  { value: '200+', label: 'Deliveries', icon: Package },
  { value: '98%', label: 'Satisfaction', icon: Star },
];

const teamMembers = [
  { name: 'James Mwangi', role: 'Fleet Manager', photo: images.about.teamMembers.jamesMwangi, description: 'Oversees all vehicle operations and maintenance schedules.' },
  { name: 'Sarah Kimani', role: 'Logistics Coordinator', photo: images.about.teamMembers.sarahKimani, description: 'Coordinates routes and ensures on-time deliveries.' },
  { name: 'David Ochieng', role: 'Lead Driver', photo: images.about.teamMembers.davidOchieng, description: 'Senior driver with 10+ years of long-haul experience.' },
  { name: 'Grace Wanjiku', role: 'Dispatcher', photo: images.about.teamMembers.graceWanjiku, description: 'Manages real-time dispatch and driver communications.' },
  { name: 'Peter Kamau', role: 'Safety Officer', photo: images.about.teamMembers.peterKamau, description: 'Ensures fleet compliance and cargo safety standards.' },
  { name: 'Alice Njeri', role: 'Operations Manager', photo: images.about.teamMembers.aliceNjeri, description: 'Leads daily operations and strategic logistics planning.' },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | JJ Transport</title>
        <meta name="description" content="Learn about JJ Transport's history, mission, and the team behind our logistics services." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden py-28 lg:py-36" style={{ background: 'linear-gradient(135deg, #163A5F 0%, #204B74 55%, #2A5F90 100%)' }}>
        <div className="absolute inset-0">
          <img src={images.about.facility} alt="" className="h-full w-full object-cover opacity-20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#163A5F]/60 to-[#163A5F]" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C29A4A]/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHero className="mx-auto max-w-3xl text-center">
            <AnimatedHeroItem>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C29A4A]/20 bg-[#C29A4A]/10 px-4 py-1.5 text-sm font-medium text-[#C29A4A]">
                <Award size={14} />
                Our Story
              </div>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl font-heading">
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
      <AnimatedSection className="py-20" style={{ background: 'linear-gradient(135deg, #163A5F 0%, #204B74 55%, #2A5F90 100%)' }}>
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
                  <Icon size={28} className="mx-auto text-[#C29A4A]" />
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C29A4A]/10 text-[#C29A4A]">
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

      {/* Team */}
      <AnimatedSection className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Meet Our Team" subtitle="Experienced professionals dedicated to your cargo." centered />
          <AnimatedGrid className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, i) => (
              <AnimatedCard key={member.name} index={i} className="group h-full">
                <div className="h-full overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-950">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${member.name === 'Sarah Kimani' || member.name === 'David Ochieng' || member.name === 'Peter Kamau' ? 'object-cover object-top' : 'object-cover'}`}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                      <h4 className="text-lg font-bold text-white">{member.name}</h4>
                      <p className="text-sm text-[#C29A4A]">{member.role}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{member.description}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </AnimatedGrid>
        </div>
      </AnimatedSection>
    </>
  );
}
