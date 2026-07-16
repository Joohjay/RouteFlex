import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { usePublicProfile } from '@/hooks/usePublicData';

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
    <footer className="relative bg-[#0a0e1a] text-gray-300">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f59e0b]/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <img
                src="/images/logo/jj-transports-logo-new-design-removebg-preview.png"
                alt="JJ Transport"
                className="h-[150px] w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm leading-relaxed text-gray-400">
              {company?.tagline ?? 'Premium freight and logistics solutions for businesses of all sizes. We deliver with precision, care, and reliability.'}
            </p>
            <div className="mt-6 flex gap-3">
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-[#f59e0b] hover:text-[#0a0e1a]">
                  <Facebook size={16} />
                </a>
              )}
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-[#f59e0b] hover:text-[#0a0e1a]">
                  <Instagram size={16} />
                </a>
              )}
              {settings?.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-[#f59e0b] hover:text-[#0a0e1a]">
                  <Linkedin size={16} />
                </a>
              )}
              {settings?.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-[#f59e0b] hover:text-[#0a0e1a]">
                  <Twitter size={16} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white">Services</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="group inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-[#f59e0b]">
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
                  <Link to={link.href} className="group inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-[#f59e0b]">
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
                  <Link to={link.href} className="group inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-[#f59e0b]">
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
          {company?.phone && (
            <a href={`tel:${company.phone}`} className="group flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-[#f59e0b]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 group-hover:bg-[#f59e0b] group-hover:text-[#0a0e1a]">
                <Phone size={14} />
              </span>
              {company.phone}
            </a>
          )}
          {company?.email && (
            <a href={`mailto:${company.email}`} className="group flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-[#f59e0b]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 group-hover:bg-[#f59e0b] group-hover:text-[#0a0e1a]">
                <Mail size={14} />
              </span>
              {company.email}
            </a>
          )}
          {company?.address && (
            <span className="group flex items-center gap-3 text-sm text-gray-400">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400">
                <MapPin size={14} />
              </span>
              {company.address}
            </span>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {company?.name ?? 'JJ Transport'}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-[#f59e0b]">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#f59e0b]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
