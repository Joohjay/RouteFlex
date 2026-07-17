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
        // Vans
        { companyId: company.id, name: 'Standard Cargo Van', type: 'VAN', capacityKg: 1500, description: 'Ideal for small parcels and light cargo within city limits.', features: ['GPS tracking', 'Air conditioning', 'Same-day delivery'] },
        { companyId: company.id, name: 'Extended Cargo Van', type: 'VAN', capacityKg: 2000, description: 'Spacious van for bulkier city deliveries.', features: ['GPS tracking', 'Rear camera', 'Shelving option'] },
        { companyId: company.id, name: 'Pickup Truck', type: 'PICKUP', capacityKg: 800, description: 'Compact pickup for quick deliveries and small loads.', features: ['Tailgate lift', 'Tie-downs'] },

        // Trucks
        { companyId: company.id, name: '1-Ton Delivery Truck', type: 'TRUCK_1_TON', capacityKg: 1000, description: 'Light-duty truck for local distribution.', features: ['Liftgate', 'GPS tracking'] },
        { companyId: company.id, name: '3-Ton Box Truck', type: 'TRUCK_3_TON', capacityKg: 3000, description: 'Medium-duty box truck for regional freight.', features: ['Liftgate', 'GPS tracking', 'Insulated option'] },
        { companyId: company.id, name: '5-Ton Box Truck', type: 'TRUCK_5_TON', capacityKg: 5000, description: 'Versatile medium-duty truck for regional deliveries.', features: ['Liftgate', 'GPS tracking', 'Insulated option'] },
        { companyId: company.id, name: '10-Ton Flatbed', type: 'TRUCK_10_TON', capacityKg: 10000, description: 'Heavy-duty flatbed for machinery and oversized cargo.', features: ['Winch', 'Tie-downs', 'Wide load capable'] },
        { companyId: company.id, name: '20-Ton Heavy Truck', type: 'TRUCK_20_TON', capacityKg: 20000, description: 'Maximum payload truck for bulk transport.', features: ['Hydraulic lift', 'GPS tracking', 'Dual axle'] },
        { companyId: company.id, name: 'Scania Long Haul', type: 'TRUCK_10_TON', capacityKg: 12000, description: 'Scania long-haul truck for intercity freight.', features: ['Sleeper cab', 'Cruise control', 'GPS tracking'] },
        { companyId: company.id, name: 'Volvo Heavy Duty', type: 'TRUCK_20_TON', capacityKg: 22000, description: 'Volvo heavy-duty truck for demanding routes.', features: ['I-Shift', 'LED lighting', 'Climate control'] },
        { companyId: company.id, name: 'Mercedes Actros', type: 'TRUCK_20_TON', capacityKg: 25000, description: 'Mercedes Actros for premium long-haul transport.', features: ['MirrorCam', 'Active Brake Assist', 'Predictive cruise'] },
        { companyId: company.id, name: 'IVECO Stralis', type: 'TRUCK_10_TON', capacityKg: 14000, description: 'IVECO Stralis for efficient regional distribution.', features: ['ECO mode', 'Air suspension', 'Telematics'] },
        { companyId: company.id, name: 'Mitsubishi Fuso Canter', type: 'TRUCK_3_TON', capacityKg: 3500, description: 'Compact Canter for urban deliveries with tight access.', features: ['Tight turning radius', 'Low entry', 'Dual airbags'] },
        { companyId: company.id, name: 'FAW Heavy Truck', type: 'TRUCK_20_TON', capacityKg: 26000, description: 'FAW heavy truck for bulk cargo transport.', features: ['6x4 drive', 'Air conditioning', 'Power steering'] },
        { companyId: company.id, name: 'HOWO Tipper Truck', type: 'TRUCK_20_TON', capacityKg: 28000, description: 'HOWO tipper for construction and mining materials.', features: ['Hydraulic tipper', 'Heavy-duty chassis', 'Differential lock'] },

        // Trailers
        { companyId: company.id, name: 'Curtain Side Trailer', type: 'TRAILER', capacityKg: 24000, description: 'Versatile curtain-side trailer for side loading.', features: ['Curtain walls', 'Tie-down rails', 'Anti-theft'] },
        { companyId: company.id, name: 'Enclosed Box Trailer', type: 'TRAILER', capacityKg: 22000, description: 'Fully enclosed trailer for secure cargo transport.', features: ['Rear ramp', 'Interior lighting', 'Ventilation'] },
        { companyId: company.id, name: 'Interlink Trailer', type: 'TRAILER', capacityKg: 34000, description: 'Interlink trailer for maximum volume capacity.', features: ['Double axle', 'Air brakes', 'ABS'] },
        { companyId: company.id, name: 'Flatbed Semi-Trailer', type: 'TRAILER', capacityKg: 26000, description: 'Standard flatbed semi-trailer for general freight.', features: ['Removable sides', 'Tie-down points'] },
        { companyId: company.id, name: 'Dump Trailer', type: 'TRAILER', capacityKg: 20000, description: 'Dump trailer for loose materials and aggregates.', features: ['Hydraulic dump', 'High sides', 'Tailgate'] },
        { companyId: company.id, name: 'Van Box Trailer', type: 'TRAILER', capacityKg: 18000, description: 'Van body trailer for dry goods transport.', features: ['Roll-up door', 'E-track', 'LED lights'] },
        { companyId: company.id, name: 'Conestoga Trailer', type: 'TRAILER', capacityKg: 22000, description: 'Conestoga trailer with retractable tarp system.', features: ['Rolling tarp', 'Side access', 'Weatherproof'] },
        { companyId: company.id, name: 'Roller-Bed Trailer', type: 'TRAILER', capacityKg: 20000, description: 'Roller-bed trailer for easy loading and unloading.', features: ['Roller system', 'Winch', 'Brake control'] },

        // Flatbeds
        { companyId: company.id, name: '40ft Flatbed Trailer', type: 'FLATBED', capacityKg: 26000, description: 'Standard 40ft flatbed for construction materials.', features: ['Wood deck', 'Stake pockets', 'Reflective tape'] },
        { companyId: company.id, name: '53ft Flatbed Trailer', type: 'FLATBED', capacityKg: 28000, description: 'Extra-long flatbed for oversized cargo.', features: ['Steel deck', 'Winch tracks', 'LED lighting'] },
        { companyId: company.id, name: 'Container Flatbed', type: 'FLATBED', capacityKg: 30000, description: 'Flatbed with container twist-locks for container transport.', features: ['Twist locks', 'Tandem axle', 'Air ride'] },
        { companyId: company.id, name: 'Low Flatbed Trailer', type: 'FLATBED', capacityKg: 32000, description: 'Low-profile flatbed for tall machinery.', features: ['Drop deck', 'Ramps', 'Toolbox'] },
        { companyId: company.id, name: 'Flatbed with Coil Well', type: 'FLATBED', capacityKg: 28000, description: 'Flatbed with steel coil well for coiled materials.', features: ['Coil well', 'Wood lining', 'Tie-downs'] },

        // Refrigerated
        { companyId: company.id, name: 'Refrigerated Truck', type: 'REFRIGERATED', capacityKg: 8000, description: 'Temperature-controlled truck for perishable goods.', features: ['Temperature monitoring', 'HACCP compliant', 'Dual zone'] },
        { companyId: company.id, name: 'Refrigerated Trailer', type: 'REFRIGERATED', capacityKg: 24000, description: 'Large reefer trailer for frozen and chilled cargo.', features: ['Thermo King unit', 'Data logging', 'Remote monitoring'] },
        { companyId: company.id, name: 'Multi-Temp Refrigerated', type: 'REFRIGERATED', capacityKg: 20000, description: 'Multi-temperature zone trailer for mixed loads.', features: ['3 temperature zones', 'Alarm system', 'Backup unit'] },

        // Heavy Haul (LOWBED / TANKER)
        { companyId: company.id, name: 'Lowbed Heavy Haul', type: 'LOWBED', capacityKg: 45000, description: 'Lowbed trailer for heavy machinery and equipment.', features: ['Hydraulic ramps', 'Multi-axle', 'Load binder'] },
        { companyId: company.id, name: 'Extendable Lowbed', type: 'LOWBED', capacityKg: 50000, description: 'Extendable lowbed for extra-long heavy loads.', features: ['Hydraulic extension', 'Remote control', 'LED lights'] },
        { companyId: company.id, name: 'Fuel Tanker', type: 'TANKER', capacityKg: 33000, description: 'Fuel tanker for bulk liquid transport.', features: ['Compartmentalized', 'Grounding system', 'Overflow valve'] },
        { companyId: company.id, name: 'Water Tanker', type: 'TANKER', capacityKg: 28000, description: 'Water tanker for bulk water delivery.', features: ['Spray nozzle', 'Hose reel', 'Pump system'] },
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
