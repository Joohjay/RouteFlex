import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from '../src/config/index.js';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const company = await prisma.company.upsert({
    where: { slug: 'jj-transport' },
    update: {},
    create: {
      name: 'JJ Transport',
      slug: 'jj-transport',
      tagline: 'Reliable Freight & Logistics Solutions',
      description:
        'JJ Transport is a leading logistics provider specializing in freight, cargo, and transport services across local and regional routes.',
      website: 'https://www.jjtransport.com',
      email: 'info@jjtransport.com',
      phone: '+1 (555) 123-4567',
      whatsapp: '+15551234567',
      address: '123 Logistics Way',
      city: 'Transport City',
      country: 'USA',
      timezone: 'America/New_York',
      currency: 'USD',
      isActive: true,
    },
  });

  await prisma.setting.upsert({
    where: { companyId: company.id },
    update: {},
    create: {
      companyId: company.id,
      supportEmail: 'support@jjtransport.com',
      supportPhone: '+1 (555) 123-4567',
      bookingEmail: 'bookings@jjtransport.com',
      facebookUrl: 'https://facebook.com/jjtransport',
      instagramUrl: 'https://instagram.com/jjtransport',
      linkedinUrl: 'https://linkedin.com/company/jjtransport',
      twitterUrl: 'https://twitter.com/jjtransport',
      enableBlog: true,
      enableCareers: true,
      enableTestimonials: true,
      enableQuoteEstimator: true,
      enableWhatsApp: true,
      enableOnlineBooking: true,
      defaultMetaTitle: 'JJ Transport | Reliable Freight & Logistics Solutions',
      defaultMetaDescription:
        'JJ Transport offers reliable freight, cargo, and logistics services. Get a quote, book transport, and track your shipment online.',
      whatsappNumber: '+15551234567',
      defaultCurrency: 'USD',
      taxRate: 0,
    },
  });

  const existingAdmin = await prisma.user.findFirst({
    where: { companyId: company.id, email: config.ADMIN_EMAIL },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(config.ADMIN_PASSWORD, 12);
    await prisma.user.create({
      data: {
        companyId: company.id,
        email: config.ADMIN_EMAIL,
        passwordHash,
        firstName: 'System',
        lastName: 'Administrator',
        role: UserRole.ADMIN,
        status: 'ACTIVE',
      },
    });
    // eslint-disable-next-line no-console
    console.log(`Created admin user: ${config.ADMIN_EMAIL}`);
  }

  // Seed default pricing rules
  const ruleCount = await prisma.pricingRule.count({ where: { companyId: company.id } });
  if (ruleCount === 0) {
    await prisma.pricingRule.createMany({
      data: [
        { companyId: company.id, name: 'Base booking fee', type: 'BASE_FEE', value: 50 },
        { companyId: company.id, name: 'Per kilometer rate', type: 'PER_KM', value: 2.5 },
        { companyId: company.id, name: 'Per kilogram rate', type: 'PER_KG', value: 0.05 },
        {
          companyId: company.id,
          name: 'Heavy machinery surcharge',
          type: 'CARGO_SURCHARGE',
          cargoType: 'HEAVY_MACHINERY',
          value: 150,
        },
        {
          companyId: company.id,
          name: 'Refrigerated truck surcharge',
          type: 'VEHICLE_SURCHARGE',
          vehicleType: 'REFRIGERATED',
          value: 75,
        },
        { companyId: company.id, name: 'Minimum booking fee', type: 'MINIMUM_FEE', value: 100 },
      ],
    });
  }

  const baseUrl = config.FRONTEND_URL;

  // Seed fleet: delete existing and re-create with images
  await prisma.fleetImage.deleteMany({ where: { fleet: { companyId: company.id } } });
  await prisma.fleet.deleteMany({ where: { companyId: company.id } });

  const fleetData = [
    { name: 'JJ City Runner', type: 'VAN' as const, capacityKg: 1500, image: '/images/fleet/van.jpg' },
    { name: 'JJ Metro Mover', type: 'VAN' as const, capacityKg: 1800, image: '/images/fleet/van 2.jpg' },
    { name: 'JJ Urban Express', type: 'VAN' as const, capacityKg: 2000, image: '/images/fleet/van 3.jpg' },
    { name: 'JJ Compact Hauler', type: 'PICKUP' as const, capacityKg: 800, image: '/images/fleet/van-1.jpg' },

    { name: 'JJ Road King', type: 'TRUCK_5_TON' as const, capacityKg: 5000, image: '/images/fleet/Truck 1.jpg' },
    { name: 'JJ Freight Master', type: 'TRUCK_10_TON' as const, capacityKg: 10000, image: '/images/fleet/Truck 2.jpg' },
    { name: 'JJ Cargo Pro', type: 'TRUCK_10_TON' as const, capacityKg: 12000, image: '/images/fleet/Truck 3.jpg' },
    { name: 'JJ Long Haul', type: 'TRUCK_20_TON' as const, capacityKg: 20000, image: '/images/fleet/Truck 4.jpg' },
    { name: 'JJ Load Master', type: 'TRUCK_20_TON' as const, capacityKg: 22000, image: '/images/fleet/Truck 5.jpg' },
    { name: 'JJ Highway Cruiser', type: 'TRUCK_10_TON' as const, capacityKg: 14000, image: '/images/fleet/Truck 6.jpg' },
    { name: 'JJ Heavy Mover', type: 'TRUCK_20_TON' as const, capacityKg: 25000, image: '/images/fleet/Truck 7.jpg' },
    { name: 'JJ Transport Pro', type: 'TRUCK_5_TON' as const, capacityKg: 5000, image: '/images/fleet/Truck 8.jpg' },
    { name: 'JJ Hauler X', type: 'TRUCK_10_TON' as const, capacityKg: 12000, image: '/images/fleet/Truck 9.jpg' },
    { name: 'JJ Cargo King', type: 'TRUCK_20_TON' as const, capacityKg: 26000, image: '/images/fleet/Truck 10.jpg' },
    { name: 'JJ Freight Runner', type: 'TRUCK_10_TON' as const, capacityKg: 14000, image: '/images/fleet/Scania 1.jpg' },
    { name: 'JJ Load Runner', type: 'TRUCK_20_TON' as const, capacityKg: 25000, image: '/images/fleet/SCANIA.jpg' },
    { name: 'Scania Long Haul', type: 'TRUCK_10_TON' as const, capacityKg: 12000, image: '/images/fleet/Scania 1.jpg' },
    { name: 'Volvo Heavy Duty', type: 'TRUCK_20_TON' as const, capacityKg: 22000, image: '/images/fleet/VOLVO.jpg' },
    { name: 'Mercedes Actros', type: 'TRUCK_20_TON' as const, capacityKg: 25000, image: '/images/fleet/Mercedez Altros.jpg' },
    { name: 'IVECO Stralis', type: 'TRUCK_10_TON' as const, capacityKg: 14000, image: '/images/fleet/IVECO.jpg' },
    { name: 'Mitsubishi Fuso Canter', type: 'TRUCK_3_TON' as const, capacityKg: 3500, image: '/images/fleet/2014 Mitsubishi Fuso Canter TKG-FEB80.jpg' },
    { name: 'FAW Heavy Truck', type: 'TRUCK_20_TON' as const, capacityKg: 26000, image: '/images/fleet/FAW truck (2).jpg' },
    { name: 'HOWO Tipper Truck', type: 'TRUCK_20_TON' as const, capacityKg: 28000, image: '/images/fleet/HOWO 380 CV camion benne 6x4 - Camion HOWO.jpg' },

    { name: 'JJ Cargo Carrier', type: 'TRAILER' as const, capacityKg: 24000, image: '/images/fleet/Trailer.jpg' },
    { name: 'JJ Bulk Mover', type: 'TRAILER' as const, capacityKg: 22000, image: '/images/fleet/Trailer (2).jpg' },
    { name: 'JJ Secure Trailer', type: 'TRAILER' as const, capacityKg: 26000, image: '/images/fleet/closed trailers.jpg' },
    { name: 'JJ Curtainsider', type: 'TRAILER' as const, capacityKg: 24000, image: '/images/fleet/Curtainsider Trailers.jpg' },
    { name: 'JJ Box Trailer', type: 'TRAILER' as const, capacityKg: 18000, image: '/images/fleet/trailer Covers.jpg' },

    { name: 'JJ Flatbed Pro', type: 'FLATBED' as const, capacityKg: 26000, image: '/images/fleet/flatbed.jpg' },
    { name: 'JJ Open Carrier', type: 'FLATBED' as const, capacityKg: 28000, image: '/images/fleet/flatbed-1.jpg' },
    { name: 'JJ Heavy Loader', type: 'FLATBED' as const, capacityKg: 32000, image: '/images/fleet/flatbed-2.jpg' },
    { name: 'JJ Deck Master', type: 'FLATBED' as const, capacityKg: 26000, image: '/images/fleet/flatbed-3.jpg' },

    { name: 'JJ Cold Chain', type: 'REFRIGERATED' as const, capacityKg: 8000, image: '/images/fleet/Refrigerated Truck.jpg' },
    { name: 'JJ Cool Runner', type: 'REFRIGERATED' as const, capacityKg: 24000, image: '/images/fleet/refrigerated trailer.jpg' },
    { name: 'JJ Temp Control', type: 'REFRIGERATED' as const, capacityKg: 20000, image: '/images/fleet/refrigerated trailer (2).jpg' },
    { name: 'JJ Chill Master', type: 'REFRIGERATED' as const, capacityKg: 16000, image: '/images/fleet/refrigirated Truck 1.jpg' },

    { name: 'JJ Heavy King', type: 'LOWBED' as const, capacityKg: 45000, image: '/images/fleet/heavy haul.jpg' },
    { name: 'JJ Massive Haul', type: 'LOWBED' as const, capacityKg: 50000, image: '/images/fleet/heavy haul scania.jpg' },
    { name: 'JJ Oversize Pro', type: 'LOWBED' as const, capacityKg: 48000, image: '/images/fleet/heavy.jpg' },
    { name: 'Fuel Tanker', type: 'TANKER' as const, capacityKg: 33000, image: '/images/fleet/HOWO 380 CV camion benne 6x4 - Camion HOWO.jpg' },
  ];

  for (const v of fleetData) {
    await prisma.fleet.create({
      data: {
        companyId: company.id,
        name: v.name,
        type: v.type,
        capacityKg: v.capacityKg,
        status: 'ACTIVE',
        features: [],
        images: {
          create: [{ url: `${baseUrl}${v.image}`, publicId: '', sortOrder: 0 }],
        },
      },
    });
  }

  // Seed gallery
  const galleryCount = await prisma.gallery.count({ where: { companyId: company.id } });
  if (galleryCount === 0) {
    const galleryItems = [
      { title: 'Fleet Operations', category: 'FLEET', image: '/images/gallery/gallery-1.jpg' },
      { title: 'Loading Operations', category: 'OPERATIONS', image: '/images/gallery/gallery-2.jpg' },
      { title: 'Warehouse Facility', category: 'FACILITY', image: '/images/gallery/gallery-3.jpg' },
      { title: 'Team at Work', category: 'TEAM', image: '/images/gallery/gallery-4.jpg' },
      { title: 'Cargo Logistics', category: 'OPERATIONS', image: '/images/gallery/gallery-5.jpg' },
      { title: 'Fleet Lineup', category: 'FLEET', image: '/images/gallery/gallery-6.jpg' },
    ];

    await prisma.gallery.createMany({
      data: galleryItems.map((item, i) => ({
        companyId: company.id,
        title: item.title,
        category: item.category,
        imageUrl: `${baseUrl}${item.image}`,
        publicId: '',
        isActive: true,
        sortOrder: i,
      })),
    });
  }

  // Seed sample services
  const serviceCount = await prisma.service.count({ where: { companyId: company.id } });
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          companyId: company.id,
          title: 'Local Freight',
          slug: 'local-freight',
          summary: 'Reliable local pickup and delivery services.',
          description:
            'Our local freight service covers same-day and next-day deliveries within city limits, with real-time tracking and professional drivers.',
        },
        {
          companyId: company.id,
          title: 'Long Haul Transport',
          slug: 'long-haul-transport',
          summary: 'Regional and interstate cargo transport.',
          description:
            'We move full and partial truckloads across regions with scheduled departures and dedicated support.',
        },
        {
          companyId: company.id,
          title: 'Refrigerated Transport',
          slug: 'refrigerated-transport',
          summary: 'Temperature-controlled logistics.',
          description:
            'Keep perishables fresh with our refrigerated fleet and continuous temperature monitoring.',
        },
        {
          companyId: company.id,
          title: 'Heavy Haul',
          slug: 'heavy-haul',
          summary: 'Oversized and heavy machinery transport.',
          description:
            'Specialized equipment and permits for oversized loads, construction machinery, and industrial equipment.',
        },
      ],
    });
  }

  // Seed sample testimonials
  const testimonialCount = await prisma.testimonial.count({ where: { companyId: company.id } });
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          companyId: company.id,
          author: 'Michael Roberts',
          role: 'Operations Manager',
          company: 'BuildRight Corp',
          content:
            'JJ Transport handled our heavy machinery deliveries flawlessly. Professional team and on-time every time.',
          rating: 5,
        },
        {
          companyId: company.id,
          author: 'Sarah Chen',
          role: 'Supply Chain Lead',
          company: 'FreshFoods Inc',
          content:
            'The refrigerated transport service is outstanding. Temperature logs give us complete confidence.',
          rating: 5,
        },
      ],
    });
  }

  // eslint-disable-next-line no-console
  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
