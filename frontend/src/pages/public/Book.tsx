import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/seo/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, ArrowRight, ArrowLeft, Check, Loader2, Package, MapPin, ClipboardList, Weight, Calendar, Building2, User, Phone, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { usePublicServices } from '@/hooks/usePublicData';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { AnimatedHero, AnimatedHeroItem } from '@/animations';
import { PremiumCard } from '@/components/premium';
import { RoadProgress } from '@/animations/cinematic';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, label: 'Service', icon: Package },
  { id: 2, label: 'Details', icon: ClipboardList },
  { id: 3, label: 'Contact', icon: User },
  { id: 4, label: 'Review', icon: Check },
];

const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  pickupAddress: z.string().min(5, 'Pickup address is required'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  pickupDate: z.string().min(1, 'Pickup date is required'),
  deliveryDate: z.string().min(1, 'Estimated delivery date is required'),
  cargoDescription: z.string().min(10, 'Please describe your cargo'),
  weight: z.string().min(1, 'Estimated weight is required'),
  dimensions: z.string().optional(),
  specialInstructions: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Phone number is required'),
  company: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

const defaultValues: BookingForm = {
  serviceId: '',
  pickupAddress: '',
  deliveryAddress: '',
  pickupDate: '',
  deliveryDate: '',
  cargoDescription: '',
  weight: '',
  dimensions: '',
  specialInstructions: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
};

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

function StepIcon({ step, serviceName, weight }: { step: number; serviceName?: string; weight?: string }) {
  const icons: Record<number, { icon: typeof Package; label: string; value?: string }> = {
    1: { icon: Package, label: 'Service', value: serviceName },
    2: { icon: ClipboardList, label: 'Details', value: weight ? `${weight} lbs` : undefined },
    3: { icon: User, label: 'Contact' },
    4: { icon: Check, label: 'Review' },
  };
  const current = icons[step];
  const Icon = current!.icon;
  const label = current!.label;
  const value = current!.value;
  return (
    <div className="flex items-center gap-3 rounded-lg bg-[#C29A4A]/5 p-3 text-sm">
      <Icon size={18} className="shrink-0 text-[#C29A4A]" />
      <div>
        <span className="text-muted-foreground">{label}</span>
        {value && <p className="font-medium">{value}</p>}
      </div>
    </div>
  );
}

function calculateQuote(data: BookingForm, _serviceName: string): string {
  const weight = parseFloat(data.weight) || 0;
  const baseRate = 150;
  const weightRate = weight * 2.5;
  const total = baseRate + weightRate;
  return total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default function Book() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: services } = usePublicServices();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  const selectedServiceId = watch('serviceId');
  const selectedService = services?.find((s) => s.id === selectedServiceId);
  const formValues = watch();

  const validateStep = async (stepNum: number): Promise<boolean> => {
    switch (stepNum) {
      case 1: return await trigger(['serviceId']);
      case 2: return await trigger(['pickupAddress', 'deliveryAddress', 'pickupDate', 'deliveryDate', 'cargoDescription', 'weight']);
      case 3: return await trigger(['firstName', 'lastName', 'email', 'phone']);
      default: return true;
    }
  };

  const estimate = calculateQuote(formValues, selectedService?.title ?? '');

  const onNext = async () => {
    const valid = await validateStep(step);
    if (valid && step < 4) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const onBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const onSubmit = async (data: BookingForm) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/public/bookings', data);
      const booking = response.data.data;
      toast.success('Booking submitted successfully!');
      navigate(`/book/success?reference=${booking.referenceNumber ?? ''}`);
    } catch {
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
  title="Book Transport"
  description="Book freight and logistics services with JJ Transport. Get a quote and schedule your shipment in minutes for delivery across Tanzania and East Africa."
  canonical="/book"
/>

      {/* Hero */}
      <section className="relative overflow-hidden py-28 lg:py-36" style={{ background: 'linear-gradient(135deg, #163A5F 0%, #204B74 55%, #2A5F90 100%)' }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C29A4A]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHero className="mx-auto max-w-3xl text-center">
            <AnimatedHeroItem>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C29A4A]/20 bg-[#C29A4A]/10 px-4 py-1.5 text-sm font-medium text-[#C29A4A] backdrop-blur-sm">
                <Truck size={14} />
                Book Transport
              </div>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl font-heading">
                Book Transport
              </h1>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
                Tell us about your shipment and get an instant quote. Our team will handle the rest.
              </p>
            </AnimatedHeroItem>
          </AnimatedHero>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <PremiumCard variant="elevated" hover="none">
            <div className="p-8">
              <RoadProgress steps={steps} currentStep={step} className="mb-8" />

              {/* Step summary on mobile */}
              <div className="mb-6 grid grid-cols-4 gap-2 sm:hidden">
                {[1, 2, 3, 4].map((s) => (
                  <StepIcon
                    key={s}
                    step={s}
                    serviceName={selectedService?.title}
                    weight={formValues.weight}
                  />
                ))}
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    {step === 1 && (
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm font-medium">Select Service</label>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {services?.map((service) => {
                              const isSelected = selectedServiceId === service.id;
                              return (
                                <label
                                  key={service.id}
                                  className={cn(
                                    'relative flex cursor-pointer items-start gap-3 rounded-xl border-2 p-5 transition-all',
                                    isSelected
                                      ? 'border-[#C29A4A] bg-[#C29A4A]/5 shadow-sm'
                                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                                  )}
                                >
                                  <input
                                    type="radio"
                                    {...register('serviceId')}
                                    value={service.id}
                                    className="mt-1 accent-[#C29A4A]"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C29A4A]/10 text-[#C29A4A]">
                                        <Truck size={16} />
                                      </div>
                                      <p className="font-semibold">{service.title}</p>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                      {service.summary ?? service.description}
                                    </p>
                                  </div>
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute right-3 top-3"
                                    >
                                      <Check size={16} className="text-[#C29A4A]" />
                                    </motion.div>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                          {errors.serviceId && <p className="mt-1 text-sm text-red-500">{errors.serviceId.message}</p>}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <MapPin size={14} className="text-[#C29A4A]" />
                              Pickup Address
                            </label>
                            <Input {...register('pickupAddress')} placeholder="123 Main St, City" />
                            {errors.pickupAddress && <p className="text-sm text-red-500">{errors.pickupAddress.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <MapPin size={14} className="text-[#C29A4A]" />
                              Delivery Address
                            </label>
                            <Input {...register('deliveryAddress')} placeholder="456 Oak Ave, City" />
                            {errors.deliveryAddress && <p className="text-sm text-red-500">{errors.deliveryAddress.message}</p>}
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <Calendar size={14} className="text-[#C29A4A]" />
                              Pickup Date
                            </label>
                            <Input {...register('pickupDate')} type="date" />
                            {errors.pickupDate && <p className="text-sm text-red-500">{errors.pickupDate.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <Calendar size={14} className="text-[#C29A4A]" />
                              Delivery Date
                            </label>
                            <Input {...register('deliveryDate')} type="date" />
                            {errors.deliveryDate && <p className="text-sm text-red-500">{errors.deliveryDate.message}</p>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium">
                            <FileText size={14} className="text-[#C29A4A]" />
                            Cargo Description
                          </label>
                          <Textarea {...register('cargoDescription')} rows={3} placeholder="Describe the items you are shipping..." />
                          {errors.cargoDescription && <p className="text-sm text-red-500">{errors.cargoDescription.message}</p>}
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <Weight size={14} className="text-[#C29A4A]" />
                              Estimated Weight (lbs)
                            </label>
                            <Input {...register('weight')} type="number" placeholder="1000" />
                            {errors.weight && <p className="text-sm text-red-500">{errors.weight.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium">Dimensions (optional)</label>
                            <Input {...register('dimensions')} placeholder="e.g. 48x40x48 in" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium">Special Instructions (optional)</label>
                          <Textarea {...register('specialInstructions')} rows={2} placeholder="Any special handling requirements..." />
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <User size={14} className="text-[#C29A4A]" />
                              First Name
                            </label>
                            <Input {...register('firstName')} placeholder="John" />
                            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <User size={14} className="text-[#C29A4A]" />
                              Last Name
                            </label>
                            <Input {...register('lastName')} placeholder="Smith" />
                            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <Mail size={14} className="text-[#C29A4A]" />
                              Email
                            </label>
                            <Input {...register('email')} type="email" placeholder="john@example.com" />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <Phone size={14} className="text-[#C29A4A]" />
                              Phone
                            </label>
                            <Input {...register('phone')} type="tel" placeholder="+1 (555) 123-4567" />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium">
                            <Building2 size={14} className="text-[#C29A4A]" />
                            Company (optional)
                          </label>
                          <Input {...register('company')} placeholder="Your Company LLC" />
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-6">
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                          className="overflow-hidden rounded-2xl border border-[#C29A4A]/20 bg-gradient-to-br from-[#C29A4A]/5 to-[#C29A4A]/10 p-6"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C29A4A]">
                              <Truck size={28} className="text-[#163A5F]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Estimated Quote</p>
                              <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl font-extrabold text-[#C29A4A]"
                              >
                                {estimate}
                              </motion.p>
                            </div>
                          </div>
                        </motion.div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2 rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Service</p>
                            <p className="font-semibold">{selectedService?.title ?? '—'}</p>
                          </div>
                          <div className="space-y-2 rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Weight</p>
                            <p className="font-semibold">{formValues.weight ? `${formValues.weight} lbs` : '—'}</p>
                          </div>
                          <div className="space-y-2 rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pickup</p>
                            <p className="font-semibold">{formValues.pickupAddress || '—'}</p>
                          </div>
                          <div className="space-y-2 rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Delivery</p>
                            <p className="font-semibold">{formValues.deliveryAddress || '—'}</p>
                          </div>
                        </div>

                        <div className="space-y-2 rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Contact</p>
                          <p className="font-semibold">{formValues.firstName} {formValues.lastName}</p>
                          <p className="text-sm text-muted-foreground">{formValues.email} &bull; {formValues.phone}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="mt-10 flex items-center justify-between border-t pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={step === 1}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Back
                  </Button>

                  <div className="flex items-center gap-3">
                    <span className="hidden text-sm text-muted-foreground sm:block">
                      Step {step} of 4
                    </span>
                    {step < 4 ? (
                      <Button type="button" onClick={onNext}>
                        Next
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting} className="bg-[#C29A4A] text-[#163A5F] hover:bg-[#B8863A] shadow-lg shadow-[#C29A4A]/25">
                        {isSubmitting ? (
                          <Loader2 size={18} className="mr-2 animate-spin" />
                        ) : (
                          <Check size={18} className="mr-2" />
                        )}
                        Submit Booking
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </PremiumCard>
        </div>
      </section>
    </>
  );
}
