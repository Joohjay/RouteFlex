import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent } from '@/components/ui/Card';
import { usePublicProfile } from '@/hooks/usePublicData';
import { api } from '@/lib/api';
import { images } from '@/lib/images';
import { toast } from 'sonner';
import { AnimatedHero, AnimatedHeroItem, AnimatedSection } from '@/animations';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

function OfficeCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  href?: string;
}) {
  const Wrapper = href ? 'a' : 'div';
  return (
    <Wrapper
      href={href}
      className={`group flex items-start gap-4 rounded-xl p-4 transition-colors ${href ? 'hover:bg-[#f59e0b]/5' : ''}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f59e0b]/10 text-[#f59e0b]">
        <Icon size={20} />
      </span>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`mt-0.5 font-semibold ${href ? 'text-[#f59e0b]' : 'text-gray-900 dark:text-white'}`}>
          {value}
        </p>
      </div>
    </Wrapper>
  );
}

export default function Contact() {
  const { data } = usePublicProfile();
  const company = data?.company;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (formData: ContactForm) => {
    try {
      await api.post('/public/contact', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | JJ Transport</title>
        <meta name="description" content="Get in touch with JJ Transport for freight and logistics inquiries. Contact our team for quotes, support, and partnerships." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0e1a] py-28 lg:py-36">
        <div className="absolute inset-0">
          <img src={images.contact.office} alt="" className="h-full w-full object-cover opacity-25" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/70 to-[#0a0e1a]" />
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b]/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHero className="mx-auto max-w-3xl text-center">
            <AnimatedHeroItem>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-4 py-1.5 text-sm font-medium text-[#f59e0b]">
                <Mail size={14} />
                Get in Touch
              </div>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Contact Us
              </h1>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
                Have a question, need a quote, or want to discuss a partnership? We are here to help.
              </p>
            </AnimatedHeroItem>
          </AnimatedHero>
        </div>
      </section>

      {/* Content */}
      <AnimatedSection className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Info */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold">Let&apos;s Talk</h2>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Our team is ready to assist you with any inquiries.
                  </p>
                </div>
                <div className="space-y-2">
                  {company?.phone && (
                    <OfficeCard icon={Phone} label="Phone" value={company.phone} href={`tel:${company.phone}`} />
                  )}
                  {company?.email && (
                    <OfficeCard icon={Mail} label="Email" value={company.email} href={`mailto:${company.email}`} />
                  )}
                  {company?.address && (
                    <OfficeCard icon={MapPin} label="Address" value={company.address} />
                  )}
                  <OfficeCard icon={Clock} label="Working Hours" value="Mon - Fri: 8:00 AM - 6:00 PM" />
                </div>
              </div>

              {/* Office image */}
              <div className="mt-10 overflow-hidden rounded-2xl border">
                <div className="relative h-56">
                  <img src={images.contact.office} alt="Our office" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <MapPin size={16} className="text-[#f59e0b]" />
                    <span className="text-sm font-medium drop-shadow">{company?.address ?? 'Our Location'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <Card className="border-0 bg-white shadow-sm dark:bg-gray-950">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium">Full Name</label>
                        <Input {...register('name')} className="mt-1" placeholder="John Smith" />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Email</label>
                        <Input {...register('email')} type="email" className="mt-1" placeholder="john@example.com" />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium">Phone (optional)</label>
                        <Input {...register('phone')} type="tel" className="mt-1" placeholder="+1 (555) 123-4567" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Subject</label>
                        <Input {...register('subject')} className="mt-1" placeholder="How can we help?" />
                        {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Message</label>
                      <Textarea
                        {...register('message')}
                        className="mt-1"
                        rows={5}
                        placeholder="Tell us about your shipping needs..."
                      />
                      {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full bg-[#0a0e1a] text-white hover:bg-[#1a1f2e] sm:w-auto">
                      {isSubmitting ? (
                        <Loader2 size={18} className="mr-2 animate-spin" />
                      ) : (
                        <Send size={18} className="mr-2" />
                      )}
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
