import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SEO } from '@/components/seo/SEO';

const faqs = [
  {
    question: 'How do I request a transport quote?',
    answer:
      'You can request a quote instantly through our online booking form. Enter your pickup, destination, cargo type, weight, and preferred vehicle, and our system will generate an estimate.',
  },
  {
    question: 'Is the online quote the final price?',
    answer:
      'No. The online estimate is calculated based on standard pricing rules. The final price will be confirmed by JJ Transport after reviewing your specific requirements.',
  },
  {
    question: 'What types of cargo do you transport?',
    answer:
      'We handle general cargo, perishables, fragile items, heavy machinery, vehicles, containers, and more. Our fleet includes refrigerated trucks, flatbeds, and heavy-duty vehicles.',
  },
  {
    question: 'How can I track my shipment?',
    answer:
      'Use our Track Shipment page and enter your reference number. You will see the current status and history of your transport request.',
  },
  {
    question: 'Do you offer same-day delivery?',
    answer:
      'Yes, same-day delivery is available for local transport requests depending on availability and route. Contact us for urgent bookings.',
  },
  {
    question: 'Are my goods insured during transport?',
    answer:
      'Yes, we provide insurance options for cargo in transit. Coverage details are confirmed during booking and quote acceptance.',
  },
];

export default function FAQ() {
  return (
    <>
      <SEO
  title="FAQ"
  description="Frequently asked questions about JJ Transport's freight and logistics services. Find answers about booking, tracking, pricing, and delivery."
  canonical="/faq"
/>
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold sm:text-5xl"
          >
            Frequently Asked Questions
          </motion.h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
            Find answers to common questions about our services and booking process.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Common Questions" centered />
          <div className="mt-12 space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-xl border bg-card p-6"
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="mt-2 text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
