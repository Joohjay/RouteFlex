import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, ArrowRight, ArrowLeft, Check, Loader2, Package, MapPin, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent } from '@/components/ui/Card';
import { usePublicServices } from '@/hooks/usePublicData';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { AnimatedHero, AnimatedHeroItem } from '@/animations';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, label: 'Service', icon: Package },
  { id: 2, label: 'Details', icon: ClipboardList },
  { id: 3, label: 'Contact', icon: MapPin },
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

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-10">
      <div className="hidden items-center justify-between sm:flex">
        {steps.map((step, i) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all',
                    isCompleted
                      ? 'border-[#f59e0b] bg-[#f59e0b] text-white'
                      : isCurrent
                      ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-[#f59e0b]'
                      : 'border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900'
                  )}
                >
                  {isCompleted ? <Check size={18} /> : <step.icon size={18} />}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium',
                    isCurrent || isCompleted ? 'text-[#f59e0b]' : 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-4 h-px flex-1 transition-colors',
                    isCompleted ? 'bg-[#f59e0b]' : 'bg-gray-200 dark:bg-gray-700'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Mobile step indicator */}
      <div className="flex items-center justify-center sm:hidden">
        <span className="rounded-full bg-[#f59e0b]/10 px-3 py-1 text-sm font-medium text-[#f59e0b]">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.label}
        </span>
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
    if (valid && step < 4) setStep((s) => s + 1);
  };

  const onBack = () => {
    if (step > 1) setStep((s) => s - 1);
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
      <Helmet>
        <title>Book Transport | JJ Transport</title>
        <meta name="description" content="Book freight and logistics services with JJ Transport. Get a quote and schedule your shipment in minutes." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0e1a] py-28 lg:py-36">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b]/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHero className="mx-auto max-w-3xl text-center">
            <AnimatedHeroItem>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-4 py-1.5 text-sm font-medium text-[#f59e0b]">
                <Truck size={14} />
                Book Transport
              </div>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
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
          <Card className="border-0 bg-white shadow-sm dark:bg-gray-950">
            <CardContent className="p-8">
              <StepIndicator currentStep={step} />

              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step === 1 && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium">Select Service</label>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {services?.map((service) => (
                              <label
                                key={service.id}
                                className={cn(
                                  'flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all',
                                  selectedServiceId === service.id
                                    ? 'border-[#f59e0b] bg-[#f59e0b]/5'
                                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                                )}
                              >
                                <input
                                  type="radio"
                                  {...register('serviceId')}
                                  value={service.id}
                                  className="mt-1 accent-[#f59e0b]"
                                />
                                <div>
                                  <p className="font-semibold">{service.title}</p>
                                  <p className="mt-0.5 text-sm text-gray-500">{service.summary ?? service.description}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                          {errors.serviceId && <p className="mt-1 text-sm text-red-500">{errors.serviceId.message}</p>}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium">Pickup Address</label>
                            <Input {...register('pickupAddress')} className="mt-1" placeholder="123 Main St, City" />
                            {errors.pickupAddress && <p className="mt-1 text-sm text-red-500">{errors.pickupAddress.message}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Delivery Address</label>
                            <Input {...register('deliveryAddress')} className="mt-1" placeholder="456 Oak Ave, City" />
                            {errors.deliveryAddress && <p className="mt-1 text-sm text-red-500">{errors.deliveryAddress.message}</p>}
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium">Pickup Date</label>
                            <Input {...register('pickupDate')} type="date" className="mt-1" />
                            {errors.pickupDate && <p className="mt-1 text-sm text-red-500">{errors.pickupDate.message}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Estimated Delivery Date</label>
                            <Input {...register('deliveryDate')} type="date" className="mt-1" />
                            {errors.deliveryDate && <p className="mt-1 text-sm text-red-500">{errors.deliveryDate.message}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium">Cargo Description</label>
                          <Textarea {...register('cargoDescription')} className="mt-1" rows={3} placeholder="Describe the items you are shipping..." />
                          {errors.cargoDescription && <p className="mt-1 text-sm text-red-500">{errors.cargoDescription.message}</p>}
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium">Estimated Weight (lbs)</label>
                            <Input {...register('weight')} type="number" className="mt-1" placeholder="1000" />
                            {errors.weight && <p className="mt-1 text-sm text-red-500">{errors.weight.message}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Dimensions (optional)</label>
                            <Input {...register('dimensions')} className="mt-1" placeholder="e.g. 48x40x48 in" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium">Special Instructions (optional)</label>
                          <Textarea {...register('specialInstructions')} className="mt-1" rows={2} placeholder="Any special handling requirements..." />
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium">First Name</label>
                            <Input {...register('firstName')} className="mt-1" placeholder="John" />
                            {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Last Name</label>
                            <Input {...register('lastName')} className="mt-1" placeholder="Smith" />
                            {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium">Email</label>
                            <Input {...register('email')} type="email" className="mt-1" placeholder="john@example.com" />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Phone</label>
                            <Input {...register('phone')} type="tel" className="mt-1" placeholder="+1 (555) 123-4567" />
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium">Company (optional)</label>
                          <Input {...register('company')} className="mt-1" placeholder="Your Company LLC" />
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-6">
                        <div className="rounded-2xl border border-[#f59e0b]/20 bg-[#f59e0b]/5 p-6">
                          <div className="flex items-center gap-3">
                            <Truck size={24} className="text-[#f59e0b]" />
                            <div>
                              <p className="text-lg font-bold">Estimated Quote</p>
                              <p className="text-3xl font-extrabold text-[#f59e0b]">{estimate}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Service</p>
                            <p className="mt-1 font-semibold">{selectedService?.title ?? '—'}</p>
                          </div>
                          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Weight</p>
                            <p className="mt-1 font-semibold">{formValues.weight ? `${formValues.weight} lbs` : '—'}</p>
                          </div>
                          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Pickup</p>
                            <p className="mt-1 font-semibold">{formValues.pickupAddress || '—'}</p>
                          </div>
                          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Delivery</p>
                            <p className="mt-1 font-semibold">{formValues.deliveryAddress || '—'}</p>
                          </div>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Contact</p>
                          <p className="mt-1 font-semibold">{formValues.firstName} {formValues.lastName}</p>
                          <p className="text-sm text-gray-500">{formValues.email} &bull; {formValues.phone}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation buttons */}
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

                  {step < 4 ? (
                    <Button type="button" onClick={onNext}>
                      Next
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting} className="bg-[#f59e0b] text-[#0a0e1a] hover:bg-[#d97706]">
                      {isSubmitting ? (
                        <Loader2 size={18} className="mr-2 animate-spin" />
                      ) : (
                        <Check size={18} className="mr-2" />
                      )}
                      Submit Booking
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
