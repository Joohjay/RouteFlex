import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { usePublicProfile } from '@/hooks/usePublicData';

const FALLBACK_PHONE = '+255 685 959 574';
const FALLBACK_EMAIL = 'japhetjohnson377@gmail.com';
const WHATSAPP_NUMBER = '255685959574';

const footerLinks = {
  services: [
    { label: 'Local Freight', href: '/services/local-freight' },
    { label: 'Long Haul Transport', href: '/services/long-haul-transport' },
    { label: 'Refrigerated Transport', href: '/services/refrigerated-transport' },
    { label: 'Heavy Haul', href: '/services/heavy-haul' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Fleet', href: '/fleet' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Careers', href: '/careers' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Track Shipment', href: '/track' },
    { label: 'Book Transport', href: '/book' },
  ],
};

export function PublicFooter() {
  const { data } = usePublicProfile();
  const company = data?.company;
  const settings = data?.settings;

  return (
    <footer className="relative bg-[#163A5F] text-gray-300">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C29A4A]/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <img
                src="/images/logo/jj-transports-logo-truck-centerpiece-removebg-preview.png"
                alt="JJ Transport"
                className="h-24 w-auto"
              />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-400">
              {company?.tagline ?? 'Premium freight and logistics solutions for businesses of all sizes. We deliver with precision, care, and reliability.'}
            </p>
            <div className="mt-4 flex gap-2">
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-[#C29A4A] hover:text-[#163A5F]">
                  <Facebook size={16} />
                </a>
              )}
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-[#C29A4A] hover:text-[#163A5F]">
                  <Instagram size={16} />
                </a>
              )}
              {settings?.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-[#C29A4A] hover:text-[#163A5F]">
                  <Linkedin size={16} />
                </a>
              )}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-[#C29A4A] hover:text-[#163A5F]"
                title="WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              {settings?.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-[#C29A4A] hover:text-[#163A5F]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white">Services</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="group inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-[#C29A4A]">
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="group inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-[#C29A4A]">
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Support</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="group inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-[#C29A4A]">
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-4">
          <a href={`tel:${FALLBACK_PHONE}`} className="group flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-[#C29A4A]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 group-hover:bg-[#C29A4A] group-hover:text-[#163A5F]">
              <Phone size={14} />
            </span>
            {FALLBACK_PHONE}
          </a>
          <a href={`mailto:${FALLBACK_EMAIL}`} className="group flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-[#C29A4A]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 group-hover:bg-[#C29A4A] group-hover:text-[#163A5F]">
              <Mail size={14} />
            </span>
            {FALLBACK_EMAIL}
          </a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-[#C29A4A]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 group-hover:bg-[#C29A4A] group-hover:text-[#163A5F]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </span>
            WhatsApp
          </a>
          <span className="group flex items-center gap-3 text-sm text-gray-400">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400">
              <MapPin size={14} />
            </span>
            Dar es Salaam, Tanzania
          </span>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {company?.name ?? 'JJ Transport'}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-[#C29A4A]">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#C29A4A]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
