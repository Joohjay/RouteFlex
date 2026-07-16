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

  // Seed sample fleet
  const fleetCount = await prisma.fleet.count({ where: { companyId: company.id } });
  if (fleetCount === 0) {
    await prisma.fleet.createMany({
      data: [
        {
          companyId: company.id,
          name: 'Standard Cargo Van',
          type: 'VAN',
          capacityKg: 1500,
          description: 'Ideal for small parcels and light cargo within city limits.',
          features: ['GPS tracking', 'Air conditioning', 'Same-day delivery'],
        },
        {
          companyId: company.id,
          name: '5-Ton Box Truck',
          type: 'TRUCK_5_TON',
          capacityKg: 5000,
          description: 'Versatile medium-duty truck for regional deliveries.',
          features: ['Liftgate', 'GPS tracking', 'Insulated option'],
        },
        {
          companyId: company.id,
          name: '10-Ton Flatbed',
          type: 'TRUCK_10_TON',
          capacityKg: 10000,
          description: 'Heavy-duty flatbed for machinery and oversized cargo.',
          features: ['Winch', 'Tie-downs', 'Wide load capable'],
        },
        {
          companyId: company.id,
          name: 'Refrigerated Truck',
          type: 'REFRIGERATED',
          capacityKg: 8000,
          description: 'Temperature-controlled transport for perishable goods.',
          features: ['Temperature monitoring', 'HACCP compliant', 'Dual zone'],
        },
      ],
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
