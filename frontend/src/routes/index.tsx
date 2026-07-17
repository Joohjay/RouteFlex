import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { HeroSkeleton } from '@/components/ui/Skeleton';

// Public pages
const Home = lazy(() => import('@/pages/public/Home'));
const About = lazy(() => import('@/pages/public/About'));
const Services = lazy(() => import('@/pages/public/Services'));
const ServiceDetail = lazy(() => import('@/pages/public/ServiceDetail'));
const Fleet = lazy(() => import('@/pages/public/Fleet'));
const Gallery = lazy(() => import('@/pages/public/Gallery'));
const Book = lazy(() => import('@/pages/public/Book'));
const BookingSuccess = lazy(() => import('@/pages/public/BookingSuccess'));
const Track = lazy(() => import('@/pages/public/Track'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const FAQ = lazy(() => import('@/pages/public/FAQ'));
const Careers = lazy(() => import('@/pages/public/Careers'));
const Blog = lazy(() => import('@/pages/public/Blog'));
const BlogPost = lazy(() => import('@/pages/public/BlogPost'));
const NotFound = lazy(() => import('@/pages/public/NotFound'));
const ServerError = lazy(() => import('@/pages/public/ServerError'));

// Auth pages
const Login = lazy(() => import('@/pages/admin/Login'));
const Register = lazy(() => import('@/pages/admin/Register'));

// Admin pages
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Requests = lazy(() => import('@/pages/admin/Requests'));
const Quotes = lazy(() => import('@/pages/admin/Quotes'));
const FleetAdmin = lazy(() => import('@/pages/admin/Fleet'));
const ServicesAdmin = lazy(() => import('@/pages/admin/Services'));
const GalleryAdmin = lazy(() => import('@/pages/admin/Gallery'));
const BlogAdmin = lazy(() => import('@/pages/admin/Blog'));
const TestimonialsAdmin = lazy(() => import('@/pages/admin/Testimonials'));
const Users = lazy(() => import('@/pages/admin/Users'));
const NotificationsAdmin = lazy(() => import('@/pages/admin/Notifications'));
const SettingsAdmin = lazy(() => import('@/pages/admin/Settings'));

function PageWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<HeroSkeleton />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="services" element={<PageWrapper><Services /></PageWrapper>} />
        <Route path="services/:slug" element={<PageWrapper><ServiceDetail /></PageWrapper>} />
        <Route path="fleet" element={<PageWrapper><Fleet /></PageWrapper>} />
        <Route path="gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
        <Route path="book" element={<PageWrapper><Book /></PageWrapper>} />
        <Route path="book/success" element={<PageWrapper><BookingSuccess /></PageWrapper>} />
        <Route path="track" element={<PageWrapper><Track /></PageWrapper>} />
        <Route path="contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="faq" element={<PageWrapper><FAQ /></PageWrapper>} />
        <Route path="careers" element={<PageWrapper><Careers /></PageWrapper>} />
        <Route path="blog" element={<PageWrapper><Blog /></PageWrapper>} />
        <Route path="blog/:slug" element={<PageWrapper><BlogPost /></PageWrapper>} />
        <Route path="login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="500" element={<PageWrapper><ServerError /></PageWrapper>} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="requests" element={<PageWrapper><Requests /></PageWrapper>} />
        <Route path="quotes" element={<PageWrapper><Quotes /></PageWrapper>} />
        <Route path="fleet" element={<PageWrapper><FleetAdmin /></PageWrapper>} />
        <Route path="services" element={<PageWrapper><ServicesAdmin /></PageWrapper>} />
        <Route path="gallery" element={<PageWrapper><GalleryAdmin /></PageWrapper>} />
        <Route path="blog" element={<PageWrapper><BlogAdmin /></PageWrapper>} />
        <Route path="testimonials" element={<PageWrapper><TestimonialsAdmin /></PageWrapper>} />
        <Route path="users" element={<PageWrapper><Users /></PageWrapper>} />
        <Route path="notifications" element={<PageWrapper><NotificationsAdmin /></PageWrapper>} />
        <Route path="settings" element={<PageWrapper><SettingsAdmin /></PageWrapper>} />
      </Route>

      <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
    </Routes>
  );
}
