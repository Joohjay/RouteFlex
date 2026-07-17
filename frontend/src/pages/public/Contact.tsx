import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SEO } from '@/components/seo/SEO';
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { images } from '@/lib/images';
import { toast } from 'sonner';
import { AnimatedHero, AnimatedHeroItem, AnimatedSection } from '@/animations';

const CONTACT_PHONE = '+255 685 959 574';
const CONTACT_EMAIL = 'japhetjohnson377@gmail.com';

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
      className={`group flex items-start gap-4 rounded-xl p-4 transition-colors ${href ? 'hover:bg-[#C29A4A]/5' : ''}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#C29A4A]/10 text-[#C29A4A]">
        <Icon size={20} />
      </span>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`mt-0.5 font-semibold ${href ? 'text-[#C29A4A]' : 'text-gray-900 dark:text-white'}`}>
          {value}
        </p>
      </div>
    </Wrapper>
  );
}

export default function Contact() {
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
      <SEO
  title="Contact Us"
  description="Get in touch with JJ Transport for freight and logistics inquiries. Contact our team for quotes, support, and partnerships in Dar es Salaam, Tanzania."
  canonical="/contact"
/>

      {/* Hero */}
      <section className="relative overflow-hidden py-28 lg:py-36" style={{ background: 'linear-gradient(135deg, #163A5F 0%, #204B74 55%, #2A5F90 100%)' }}>
        <div className="absolute inset-0">
          <img src={images.contact.office} alt="" className="h-full w-full object-cover opacity-20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#163A5F]/60 to-[#163A5F]" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C29A4A]/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHero className="mx-auto max-w-3xl text-center">
            <AnimatedHeroItem>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C29A4A]/20 bg-[#C29A4A]/10 px-4 py-1.5 text-sm font-medium text-[#C29A4A]">
                <Mail size={14} />
                Get in Touch
              </div>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl font-heading">
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
                  <OfficeCard icon={Phone} label="Phone" value={CONTACT_PHONE} href={`tel:+255685959574`} />
                  <OfficeCard icon={Mail} label="Email" value={CONTACT_EMAIL} href={`mailto:${CONTACT_EMAIL}`} />
                  <OfficeCard icon={MapPin} label="Address" value="Dar es Salaam, Tanzania" />
                  <OfficeCard icon={Clock} label="Working Hours" value="Mon - Fri: 8:00 AM - 6:00 PM" />
                  <OfficeCard icon={Phone} label="WhatsApp" value="Chat on WhatsApp" href="https://wa.me/255685959574" />
                </div>
              </div>

              {/* Office image */}
              <div className="mt-10 overflow-hidden rounded-2xl border">
                <div className="relative h-56">
                  <img src={images.contact.office} alt="Our office" loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <MapPin size={16} className="text-[#C29A4A]" />
                    <span className="text-sm font-medium drop-shadow">Dar es Salaam, Tanzania</span>
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

                    <Button type="submit" disabled={isSubmitting} className="w-full bg-[#163A5F] text-white hover:bg-[#204B74] sm:w-auto">
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
