import { Metadata } from 'next';
import { generateServiceSlug } from '@/lib/pricing';

// Mock services data for metadata generation
const mockServices = [
  {
    id: '880e8400-e29b-41d4-a716-446655440001',
    name: 'Standard House Cleaning',
    description: 'Regular house cleaning including living areas, bedrooms, and bathrooms',
    base_price: 450.00,
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440002',
    name: 'Premium House Cleaning',
    description: 'Comprehensive house cleaning with attention to detail',
    base_price: 750.00,
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440003',
    name: 'Office Cleaning',
    description: 'Professional office cleaning including desks, floors, and common areas',
    base_price: 600.00,
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440004',
    name: 'Commercial Cleaning',
    description: 'Large commercial space cleaning',
    base_price: 1050.00,
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440005',
    name: 'Deep House Cleaning',
    description: 'Intensive cleaning including inside appliances, cabinets, and detailed scrubbing',
    base_price: 1200.00,
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440006',
    name: 'Move-in/Move-out Cleaning',
    description: 'Complete cleaning for moving in or out of property',
    base_price: 1050.00,
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440007',
    name: 'Post-Construction Cleaning',
    description: 'Specialized cleaning after construction or renovation work',
    base_price: 1500.00,
  }
];

export async function generateMetadata({ params }: { params: Promise<{ serviceSlug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const service = mockServices.find(s => generateServiceSlug(s.name) === resolvedParams.serviceSlug);
  
  if (!service) {
    return {
      title: 'Service Not Found | Shalean Cleaning Services',
      description: 'The requested cleaning service could not be found.',
    };
  }

  const title = `Book ${service.name} - Property Details | Shalean Cleaning Services`;
  const description = `Complete your ${service.name.toLowerCase()} booking. Select your property details, location in Cape Town, South Africa, and book your professional cleaning service online.`;

  return {
    title,
    description,
    keywords: [
      service.name.toLowerCase(),
      'book cleaning service',
      'property details',
      'cape town cleaning',
      'south africa',
      'cleaning booking',
      'house cleaning',
      'office cleaning',
      'professional cleaners'
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_ZA',
      siteName: 'Shalean Cleaning Services',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/booking/service/${resolvedParams.serviceSlug}/details`,
    },
  };
}

export async function generateStaticParams() {
  return mockServices.map((service) => ({
    serviceSlug: generateServiceSlug(service.name),
  }));
}
