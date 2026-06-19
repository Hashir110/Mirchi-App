import { PromoBanner } from '../types';

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: '1',
    title: 'Weekend Special',
    subtitle: 'Get 20% off on all Pizzas',
    image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600',
    discount: '20% OFF',
  },
  {
    id: '2',
    title: 'BBQ Feast',
    subtitle: 'Family platters starting at Rs.2499',
    image: 'https://images.pexels.com/photos/7649174/pexels-photo-7649174.jpeg?auto=compress&cs=tinysrgb&w=600',
    discount: 'Family Deal',
  },
  {
    id: '3',
    title: 'Desi Delights',
    subtitle: 'Authentic taste of home',
    image: 'https://images.pexels.com/photos/4750253/pexels-photo-4750253.jpeg?auto=compress&cs=tinysrgb&w=600',
    discount: 'New',
  },
  {
    id: '4',
    title: 'Free Delivery',
    subtitle: 'On orders above Rs.1500',
    image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=600',
    discount: 'FREE',
  },
];

export const LOCATIONS = [
  'Gulberg III',
  'DHA Phase 5',
  'Johar Town',
  'Bahria Town',
  'Model Town',
  'Cantt',
  'Faisal Town',
  'Garden Town',
];

export const ORDER_STATUSES = [
  { value: 'Pending', label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'Accepted', label: 'Accepted', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'Preparing', label: 'Preparing', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'Ready', label: 'Ready', color: 'bg-mirchi-500/20 text-mirchi-400 border-mirchi-500/30' },
  { value: 'Delivered', label: 'Delivered', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
] as const;

export function getStatusStyle(status: string) {
  return ORDER_STATUSES.find((s) => s.value === status) || ORDER_STATUSES[0];
}
