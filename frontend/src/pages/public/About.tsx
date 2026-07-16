import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';

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

export default function About() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold sm:text-5xl"
          >
            About JJ Transport
          </motion.h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
            A leading logistics company committed to moving goods safely, on time, and with complete
            transparency.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold">Delivering Excellence Since Day One</h2>
              <p className="mt-4 text-muted-foreground">
                JJ Transport began with a simple mission: to make freight and cargo transport reliable,
                transparent, and accessible. Over the years, we have grown into a full-service logistics
                provider serving businesses across multiple industries.
              </p>
              <p className="mt-4 text-muted-foreground">
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
              className="rounded-2xl bg-muted p-8"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">15+</div>
                  <div className="text-muted-foreground">Years in Business</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">50+</div>
                  <div className="text-muted-foreground">Vehicles</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">10K+</div>
                  <div className="text-muted-foreground">Completed Deliveries</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">98%</div>
                  <div className="text-muted-foreground">Client Satisfaction</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="What Drives Us" subtitle="Our core principles define every delivery." centered />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-xl bg-background p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
