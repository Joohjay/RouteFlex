export interface Company {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  website?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone: string;
  currency: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  companyId: string;
  primaryColor: string;
  secondaryColor: string;
  faviconUrl?: string;
  supportEmail?: string;
  supportPhone?: string;
  bookingEmail?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  enableBlog: boolean;
  enableCareers: boolean;
  enableTestimonials: boolean;
  enableQuoteEstimator: boolean;
  enableWhatsApp: boolean;
  enableOnlineBooking: boolean;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  googleAnalyticsId?: string;
  googleMapsApiKey?: string;
  whatsappNumber?: string;
  defaultCurrency: string;
  taxRate: number;
}

export type CargoType =
  | 'GENERAL'
  | 'PERISHABLE'
  | 'FRAGILE'
  | 'HEAVY_MACHINERY'
  | 'HAZARDOUS'
  | 'LIQUID'
  | 'VEHICLES'
  | 'LIVESTOCK'
  | 'CONTAINER'
  | 'OTHER';

export type VehicleType =
  | 'VAN'
  | 'PICKUP'
  | 'TRUCK_1_TON'
  | 'TRUCK_3_TON'
  | 'TRUCK_5_TON'
  | 'TRUCK_10_TON'
  | 'TRUCK_20_TON'
  | 'TRAILER'
  | 'REFRIGERATED'
  | 'TANKER'
  | 'FLATBED'
  | 'LOWBED';

export type RequestStatus =
  | 'REQUEST_SUBMITTED'
  | 'QUOTE_PREPARED'
  | 'BOOKING_CONFIRMED'
  | 'LOADING'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export interface TransportRequest {
  id: string;
  referenceNumber: string;
  name: string;
  email: string;
  phone: string;
  pickupLocation: string;
  destination: string;
  cargoType: CargoType;
  weight: number;
  vehicleType: VehicleType;
  preferredPickupDate?: string;
  notes?: string;
  estimatedDistance?: number;
  estimatedPrice?: number;
  status: RequestStatus;
  createdAt: string;
}

export interface QuoteBreakdown {
  basePrice: number;
  distancePrice: number;
  weightPrice: number;
  vehicleSurcharge: number;
  cargoSurcharge: number;
  extrasPrice: number;
  taxPrice: number;
  totalPrice: number;
  currency: string;
  distanceKm: number;
  isEstimate: boolean;
}

export interface Fleet {
  id: string;
  name: string;
  type: VehicleType;
  capacityKg: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'IN_TRANSIT' | 'RETIRED';
  description?: string;
  features: string[];
  images: { id: string; url: string; publicId?: string }[];
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Gallery {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  category?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
  viewCount: number;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  avatarUrl?: string;
}
