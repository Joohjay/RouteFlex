import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SEO } from '@/components/seo/SEO';

const openings = [
  {
    title: 'Heavy Truck Driver',
    location: 'Transport City',
    type: 'Full-time',
    description:
      'Experienced CDL driver for long-haul and regional freight routes. Competitive pay and benefits.',
  },
  {
    title: 'Logistics Coordinator',
    location: 'Transport City',
    type: 'Full-time',
    description:
      'Coordinate bookings, dispatch drivers, and provide exceptional customer support.',
  },
  {
    title: 'Fleet Maintenance Technician',
    location: 'Transport City',
    type: 'Full-time',
    description:
      'Maintain and repair our diverse fleet of trucks and specialized vehicles.',
  },
];

export default function Careers() {
  return (
    <>
      <SEO
  title="Careers"
  description="Join the JJ Transport team. Explore career opportunities in logistics, operations, and management in Dar es Salaam, Tanzania."
  canonical="/careers"
/>
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold sm:text-5xl"
          >
            Careers
          </motion.h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
            Join a team that keeps businesses moving. Explore opportunities at JJ Transport.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Open Positions"
            subtitle="We are always looking for talented individuals to join our growing team."
            centered
          />
          <div className="mt-12 space-y-6">
            {openings.map((job, index) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-6 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {job.location} &bull; {job.type}
                  </p>
                  <p className="mt-2 text-muted-foreground">{job.description}</p>
                </div>
                <Button>Apply Now</Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
