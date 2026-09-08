import { Booking, Review } from '../types';
import { MOCK_WORKERS } from './workers';

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-901',
    token: 'SYH-48291',
    customerId: 'cust-1',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 99801 22334',
    serviceId: 'ac_repair',
    serviceName: 'AC Repair & Service',
    serviceCategory: 'Cooling & HVAC',
    description: 'Split AC is blowing normal air instead of cooling; filter cleaning and gas check required.',
    address: 'Flat 402, Green Vista Apartments, 12th Main Indiranagar, Bangalore',
    city: 'Bangalore',
    scheduledDate: '2026-09-09',
    scheduledTime: '10:00 AM - 01:00 PM',
    urgency: 'NORMAL',
    tier: 'MEDIUM',
    estimatedPrice: 449,
    connectionFee: 25,
    totalPrice: 474,
    worker: MOCK_WORKERS[0], // Rahul Kumar
    status: 'ACCEPTED',
    otp: '4829',
    statusHistory: [
      { status: 'REQUESTED', timestamp: '10:15 AM', note: 'Customer created booking' },
      { status: 'MATCHED', timestamp: '10:16 AM', note: 'AI matched Rahul Kumar (Score 94%)' },
      { status: 'ACCEPTED', timestamp: '10:18 AM', note: 'Rahul Kumar accepted the assignment' }
    ],
    paymentStatus: 'PAID',
    createdAt: '2026-09-08T10:15:00Z'
  },
  {
    id: 'b-902',
    token: 'SYH-31904',
    customerId: 'cust-1',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 99801 22334',
    serviceId: 'electrician',
    serviceName: 'Electrician',
    serviceCategory: 'Electrical',
    description: 'Geyser plug point switch sparking and trip issue',
    address: 'Flat 402, Green Vista Apartments, 12th Main Indiranagar, Bangalore',
    city: 'Bangalore',
    scheduledDate: '2026-09-02',
    scheduledTime: '04:00 PM',
    urgency: 'EMERGENCY',
    tier: 'SMALL',
    estimatedPrice: 249,
    connectionFee: 25,
    totalPrice: 274,
    worker: MOCK_WORKERS[1], // Suresh Patil
    status: 'COMPLETED',
    statusHistory: [
      { status: 'REQUESTED', timestamp: '03:45 PM' },
      { status: 'MATCHED', timestamp: '03:46 PM' },
      { status: 'ACCEPTED', timestamp: '03:48 PM' },
      { status: 'ON_THE_WAY', timestamp: '04:00 PM' },
      { status: 'IN_PROGRESS', timestamp: '04:15 PM' },
      { status: 'COMPLETED', timestamp: '04:55 PM' }
    ],
    customerRating: 5,
    customerReview: 'Suresh ji arrived in 15 minutes because of the emergency tag. Fixed the geyser MCB spark cleanly and checked the grounding!',
    workerRating: 5,
    paymentStatus: 'PAID',
    createdAt: '2026-09-02T15:45:00Z',
    completedAt: '2026-09-02T16:55:00Z'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    authorName: 'Vikram Mehta',
    rating: 5,
    comment: 'Very polite, diagnosed the AC capacitor fault immediately. Cooperative verified badge gave full peace of mind.',
    date: '3 days ago',
    serviceName: 'AC Repair & Service'
  },
  {
    id: 'rev-2',
    authorName: 'Pooja Hegde',
    rating: 5,
    comment: 'Punctual and extremely professional. Did not charge unnecessary extra fees like local unregistered agents.',
    date: '1 week ago',
    serviceName: 'Electrical Wiring'
  },
  {
    id: 'rev-3',
    authorName: 'Rajesh Nambiar',
    rating: 4.8,
    comment: 'Neat work on switchboard replacement. Cleaned up the debris after work.',
    date: '2 weeks ago',
    serviceName: 'Switch Installation'
  }
];
