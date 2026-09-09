import { Booking, BookingStatus, CreateBookingDto, ApiResponse, Review } from '../types/index.ts';
import { STORAGE_KEYS } from './storage/storageKeys';
import { storageService } from './storage/storageService';
import { INITIAL_BOOKINGS } from '../data/mockData';

// Allowed state transitions according to SAHYOG System Architecture (docs/ARCHITECTURE.md Section 14)
const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  REQUESTED: ['MATCHED', 'ACCEPTED', 'CANCELLED'],
  MATCHED: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['ON_THE_WAY', 'CANCELLED'],
  ON_THE_WAY: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

class BookingService {
  /**
   * Fetch all bookings from persistent storage
   */
  public async getBookings(): Promise<ApiResponse<Booking[]>> {
    try {
      const bookings = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      return {
        success: true,
        data: bookings,
        message: `Retrieved ${bookings.length} bookings successfully.`,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to retrieve bookings',
      };
    }
  }

  /**
   * Fetch single booking by ID
   */
  public async getBookingById(bookingId: string): Promise<ApiResponse<Booking>> {
    try {
      if (!bookingId) {
        return { success: false, error: 'Booking ID is required' };
      }
      const bookings = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        return {
          success: false,
          error: `Booking with ID ${bookingId} not found.`,
        };
      }
      return { success: true, data: booking };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error fetching booking',
      };
    }
  }

  /**
   * Fetch bookings for a specific customer
   */
  public async getCustomerBookings(customerId: string): Promise<ApiResponse<Booking[]>> {
    try {
      const all = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      const customerBookings = all.filter(b => b.customerId === customerId);
      return { success: true, data: customerBookings };
    } catch (err) {
      return { success: false, error: 'Error fetching customer bookings' };
    }
  }

  /**
   * Fetch bookings for a specific worker
   */
  public async getWorkerBookings(workerId: string): Promise<ApiResponse<Booking[]>> {
    try {
      const all = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      const workerBookings = all.filter(b => b.worker?.id === workerId);
      return { success: true, data: workerBookings };
    } catch (err) {
      return { success: false, error: 'Error fetching worker bookings' };
    }
  }

  /**
   * Create a new booking and persist it
   */
  public async createBooking(dto: CreateBookingDto): Promise<ApiResponse<Booking>> {
    try {
      if (!dto.worker) {
        return { success: false, error: 'Worker must be selected for booking creation.' };
      }
      if (!dto.serviceCategory) {
        return { success: false, error: 'Service category is required.' };
      }

      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const token = `SYH-${randomNum}`;
      const base = dto.serviceCategory.basePrice || 299;
      const tierMultiplier = dto.tier === 'SMALL' ? 1 : dto.tier === 'MEDIUM' ? 1.8 : 2.8;
      const estimatedPrice = Math.round(base * tierMultiplier);
      const connectionFee = 25;
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newBooking: Booking = {
        id: `b-${Date.now()}`,
        token,
        customerId: dto.customerId || 'cust-1',
        customerName: dto.customerName || 'Ananya Deshmukh',
        customerPhone: dto.customerPhone || '+91 99801 22334',
        serviceId: dto.serviceCategory.id || 'electrician',
        serviceName: dto.serviceCategory.name || 'Electrician',
        serviceCategory: dto.serviceCategory.category || 'General',
        description: dto.problemDescription || `Requested ${dto.serviceCategory.name} (${dto.tier} Tier)`,
        imageUrl: dto.imageUrl,
        address: dto.address || 'Flat 402, Green Vista Apartments, 12th Main Indiranagar, Bangalore',
        city: dto.city || 'Bangalore',
        scheduledDate: now.toISOString().split('T')[0],
        scheduledTime: dto.urgency === 'EMERGENCY' ? 'Immediate Priority (15-20 min)' : 'Today (Next Available)',
        urgency: dto.urgency,
        tier: dto.tier,
        estimatedPrice,
        connectionFee,
        totalPrice: estimatedPrice + connectionFee,
        worker: dto.worker,
        status: 'REQUESTED',
        otp: '4829',
        statusHistory: [
          {
            status: 'REQUESTED',
            timestamp: timeString,
            note: `Booking request sent to ${dto.worker.name}`,
          },
        ],
        paymentStatus: 'PAID',
        createdAt: now.toISOString(),
      };

      const existing = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      const updated = [newBooking, ...existing];
      storageService.setItem(STORAGE_KEYS.BOOKINGS, updated);

      return {
        success: true,
        data: newBooking,
        message: `Booking ${token} created successfully.`,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to create booking',
      };
    }
  }

  /**
   * Update booking status with state transition validation
   */
  public async updateBookingStatus(
    bookingId: string,
    nextStatus: BookingStatus,
    note?: string
  ): Promise<ApiResponse<Booking>> {
    try {
      const bookings = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      const targetIndex = bookings.findIndex(b => b.id === bookingId);

      if (targetIndex === -1) {
        return { success: false, error: `Booking ${bookingId} not found.` };
      }

      const current = bookings[targetIndex];

      // Validate state transition if not idempotent
      if (current.status !== nextStatus) {
        const allowed = ALLOWED_TRANSITIONS[current.status] || [];
        if (!allowed.includes(nextStatus)) {
          return {
            success: false,
            error: `Invalid status transition from ${current.status} to ${nextStatus}. Allowed: ${allowed.join(', ') || 'None'}`,
          };
        }
      }

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const defaultNote =
        nextStatus === 'ACCEPTED' ? `${current.worker?.name || 'Worker'} accepted dispatch request` :
        nextStatus === 'ON_THE_WAY' ? `${current.worker?.name || 'Worker'} is on the way` :
        nextStatus === 'IN_PROGRESS' ? 'OTP verified. Service in progress' :
        nextStatus === 'COMPLETED' ? 'Service completed and verified' :
        nextStatus === 'CANCELLED' ? 'Booking declined/cancelled' :
        `Status updated to ${nextStatus}`;

      const updatedHistory = [
        ...current.statusHistory,
        {
          status: nextStatus,
          timestamp,
          note: note || defaultNote,
        },
      ];

      const updatedBooking: Booking = {
        ...current,
        status: nextStatus,
        statusHistory: updatedHistory,
        completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : current.completedAt,
      };

      bookings[targetIndex] = updatedBooking;
      storageService.setItem(STORAGE_KEYS.BOOKINGS, bookings);

      return {
        success: true,
        data: updatedBooking,
        message: `Booking ${current.token} status updated to ${nextStatus}.`,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update booking status',
      };
    }
  }

  /**
   * Advance booking status to the next logical stage
   */
  public async advanceBookingStatus(bookingId: string): Promise<ApiResponse<Booking>> {
    try {
      const bookings = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      const target = bookings.find(b => b.id === bookingId);
      if (!target) {
        return { success: false, error: `Booking ${bookingId} not found` };
      }

      let nextStatus: BookingStatus = target.status;
      if (target.status === 'REQUESTED' || target.status === 'MATCHED') nextStatus = 'ACCEPTED';
      else if (target.status === 'ACCEPTED') nextStatus = 'ON_THE_WAY';
      else if (target.status === 'ON_THE_WAY') nextStatus = 'IN_PROGRESS';
      else if (target.status === 'IN_PROGRESS') nextStatus = 'COMPLETED';

      return this.updateBookingStatus(bookingId, nextStatus, `Status advanced to ${nextStatus}`);
    } catch (err) {
      return { success: false, error: 'Failed to advance booking status' };
    }
  }

  /**
   * Submit customer review and rating for completed booking
   */
  public async submitCustomerReview(
    bookingId: string,
    rating: number,
    reviewText: string
  ): Promise<ApiResponse<Booking>> {
    try {
      if (rating < 1 || rating > 5) {
        return { success: false, error: 'Rating must be between 1 and 5 stars.' };
      }

      const bookings = storageService.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      const targetIndex = bookings.findIndex(b => b.id === bookingId);

      if (targetIndex === -1) {
        return { success: false, error: `Booking ${bookingId} not found.` };
      }

      const current = bookings[targetIndex];
      const updatedBooking: Booking = {
        ...current,
        customerRating: rating,
        customerReview: reviewText,
      };

      bookings[targetIndex] = updatedBooking;
      storageService.setItem(STORAGE_KEYS.BOOKINGS, bookings);

      // Also append to global reviews collection
      const reviews = storageService.getItem<Review[]>(STORAGE_KEYS.REVIEWS, []);
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        authorName: current.customerName || 'Customer',
        rating,
        comment: reviewText,
        date: 'Just now',
        serviceName: current.serviceName,
      };
      storageService.setItem(STORAGE_KEYS.REVIEWS, [newReview, ...reviews]);

      return {
        success: true,
        data: updatedBooking,
        message: 'Review and rating submitted successfully.',
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to submit review',
      };
    }
  }
}

export const bookingService = new BookingService();
