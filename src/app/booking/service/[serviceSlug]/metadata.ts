import { Metadata } from 'next';
import { generateServiceSlug } from '@/lib/pricing';

interface Service {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  per_bedroom_price: number | null;
  per_bathroom_price: number | null;
  duration_minutes: number;
  category_id: string | null;
  is_active: boolean;
}

// Mock services data for metadata generation
const mockServices: Service[] = [
  {
    id: '880e8400-e29b-41d4-a716-446655440001',
    name: 'Standard House Cleaning',
    description: 'Regular house cleaning including living areas, bedrooms, and bathrooms',
    base_price: 450.00,
    per_bedroom_price: 60.00,
    per_bathroom_price: 90.00,
    duration_minutes: 120,
    category_id: '770e8400-e29b-41d4-a716-446655440001',
    is_active: true
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440002',
    name: 'Premium House Cleaning',
    description: 'Comprehensive house cleaning with attention to detail',
    base_price: 750.00,
    per_bedroom_price: 90.00,
    per_bathroom_price: 120.00,
    duration_minutes: 180,
    category_id: '770e8400-e29b-41d4-a716-446655440001',
    is_active: true
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440003',
    name: 'Office Cleaning',
    description: 'Professional office cleaning including desks, floors, and common areas',
    base_price: 600.00,
    per_bedroom_price: null,
    per_bathroom_price: null,
    duration_minutes: 90,
    category_id: '770e8400-e29b-41d4-a716-446655440002',
    is_active: true
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440004',
    name: 'Commercial Cleaning',
    description: 'Large commercial space cleaning',
    base_price: 1050.00,
    per_bedroom_price: null,
    per_bathroom_price: null,
    duration_minutes: 240,
    category_id: '770e8400-e29b-41d4-a716-446655440002',
    is_active: true
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440005',
    name: 'Deep House Cleaning',
    description: 'Intensive cleaning including inside appliances, cabinets, and detailed scrubbing',
    base_price: 1200.00,
    per_bedroom_price: 150.00,
    per_bathroom_price: 180.00,
    duration_minutes: 300,
    category_id: '770e8400-e29b-41d4-a716-446655440003',
    is_active: true
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440006',
    name: 'Move-in/Move-out Cleaning',
    description: 'Complete cleaning for moving in or out of property',
    base_price: 1050.00,
    per_bedroom_price: 120.00,
    per_bathroom_price: 150.00,
    duration_minutes: 240,
    category_id: '770e8400-e29b-41d4-a716-446655440003',
    is_active: true
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440007',
    name: 'Post-Construction Cleaning',
    description: 'Specialized cleaning after construction or renovation work',
    base_price: 1500.00,
    per_bedroom_price: 180.00,
    per_bathroom_price: 240.00,
    duration_minutes: 360,
    category_id: '770e8400-e29b-41d4-a716-446655440004',
    is_active: true
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

  const title = `${service.name} | Professional Cleaning Services in Cape Town, South Africa`;
  const description = `${service.description} Starting from R${service.base_price.toLocaleString()}. Book online for professional cleaning services in Cape Town and surrounding areas.`;

  return {
    title,
    description,
    keywords: [
      service.name.toLowerCase(),
      'cleaning services',
      'cape town',
      'south africa',
      'house cleaning',
      'office cleaning',
      'professional cleaners',
      'book cleaning service',
      'cleaning company'
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
      canonical: `/booking/service/${resolvedParams.serviceSlug}`,
    },
  };
}

export async function generateStaticParams() {
  return mockServices.map((service) => ({
    serviceSlug: generateServiceSlug(service.name),
  }));
}
