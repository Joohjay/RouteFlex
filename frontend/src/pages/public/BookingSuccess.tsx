import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, Truck, FileText } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { usePublicProfile } from '@/hooks/usePublicData';
import { formatCurrency, generateWhatsAppLink } from '@/lib/utils';
import type { QuoteBreakdown } from '@/types';

interface LocationState {
  referenceNumber: string;
  estimate: QuoteBreakdown;
}

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: profile } = usePublicProfile();
  const company = profile?.company;
  const state = location.state as LocationState | null;

  useEffect(() => {
    if (!state?.referenceNumber) {
      navigate('/book');
    }
  }, [state, navigate]);

  if (!state) return null;

  const { referenceNumber, estimate } = state;

  const whatsappMessage = [
    `Hello ${company?.name ?? 'JJ Transport'},`,
    `I have submitted a transport request.`,
    `Reference: ${referenceNumber}`,
    `Estimated Price: ${estimate ? formatCurrency(estimate.totalPrice, estimate.currency) : 'N/A'}`,
    `Please confirm my booking.`,
  ].join('\n');

  const whatsappLink = company?.whatsapp
    ? generateWhatsAppLink(company.whatsapp, whatsappMessage)
    : null;

  return (
    <>
      <SEO title="Booking Confirmed" description="Your transport booking has been confirmed. Thank you for choosing JJ Transport." noIndex />
      <section className="py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
            <CheckCircle size={40} />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Request Submitted!</h1>
          <p className="mt-2 text-muted-foreground">
            Your transport request has been received. Our team will review it and contact you shortly.
          </p>
        </motion.div>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Reference Number</p>
                <p className="text-2xl font-bold tracking-wider text-primary">{referenceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Price</p>
                <p className="text-2xl font-bold">
                  {estimate ? formatCurrency(estimate.totalPrice, estimate.currency) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="flex-1">
                <Link to="/track">
                  <Truck size={18} className="mr-2" /> Track Shipment
                </Link>
              </Button>
              {whatsappLink && (
                <Button asChild variant="outline" className="flex-1">
                  <a href={whatsappLink} target="_blank" rel="noreferrer">
                    <MessageCircle size={18} className="mr-2 text-green-600" /> Confirm via WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            to="/services"
            className="flex items-center gap-3 rounded-xl border bg-card p-4 hover:bg-accent"
          >
            <FileText size={20} className="text-primary" />
            <span className="font-medium">Explore Services</span>
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-3 rounded-xl border bg-card p-4 hover:bg-accent"
          >
            <MessageCircle size={20} className="text-primary" />
            <span className="font-medium">Contact Support</span>
          </Link>
        </div>
      </div>
    </section>
    </>
  );
}
