import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Booking, BookingStatus, CreateBookingDto, ApiResponse, Worker } from '../../types';
import { bookingService as localBookingService } from '../bookingService';
import { Database } from '../../types/database';

type BookingRow = Database['public']['Tables']['bookings']['Row'];

/**
 * Maps Supabase Postgres booking row to SAHYOG application domain Booking interface
 */
const mapRowToBooking = (row: BookingRow, workerData?: Worker): Booking => {
  return {
    id: row.id,
    token: row.token,
    customerId: row.customer_id || 'cust-1',
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    serviceId: row.service_id || 'electrician',
    serviceName: row.service_name,
    serviceCategory: row.service_category,
    description: row.description || '',
    imageUrl: row.image_url || undefined,
    address: row.address,
    city: row.city,
    scheduledDate: row.scheduled_date,
    scheduledTime: row.scheduled_time,
    urgency: row.urgency,
    tier: row.tier,
    estimatedPrice: row.estimated_price,
    connectionFee: row.connection_fee,
    totalPrice: row.total_price,
    worker: workerData,
    status: row.status,
    statusHistory: [],
    customerRating: row.customer_rating || undefined,
    customerReview: row.customer_review || undefined,
    workerRating: row.worker_rating || undefined,
    workerReview: row.worker_review || undefined,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
    completedAt: row.completed_at || undefined,
    otp: row.otp,
  };
};

export class SupabaseBookingService {
  /**
   * Fetch all bookings from Supabase (or fallback to local storage)
   */
  public async getBookings(): Promise<ApiResponse<Booking[]>> {
    if (!isSupabaseConfigured()) {
      return localBookingService.getBookings();
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const bookings = ((data || []) as unknown as BookingRow[]).map((row) => mapRowToBooking(row));
      return { success: true, data: bookings };
    } catch (err: unknown) {
      console.warn('Supabase getBookings failed, falling back to local service:', err);
      return localBookingService.getBookings();
    }
  }

  /**
   * Fetch single booking by ID or Token
   */
  public async getBookingById(bookingId: string): Promise<ApiResponse<Booking>> {
    if (!isSupabaseConfigured()) {
      return localBookingService.getBookingById(bookingId);
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (error || !data) throw error || new Error('Booking not found');

      return { success: true, data: mapRowToBooking(data as unknown as BookingRow) };
    } catch (err: unknown) {
      return localBookingService.getBookingById(bookingId);
    }
  }

  /**
   * Create a new booking server-side in Supabase
   */
  public async createBooking(dto: CreateBookingDto): Promise<ApiResponse<Booking>> {
    if (!isSupabaseConfigured()) {
      return localBookingService.createBooking(dto);
    }

    try {
      const basePrice = dto.serviceCategory.basePrice;
      const multiplier = dto.tier === 'SMALL' ? 1 : dto.tier === 'MEDIUM' ? 1.8 : 2.8;
      const estimatedPrice = Math.round(basePrice * multiplier);
      const connectionFee = 25;
      const totalPrice = estimatedPrice + connectionFee;
      const workerPayout = estimatedPrice;
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const token = `SYH-${randomSuffix}`;
      const startOtp = '4829';

      const insertData = {
        token,
        customer_id: dto.customerId || null,
        customer_name: dto.customerName || 'Customer',
        customer_phone: dto.customerPhone || '+91 99801 22334',
        service_id: dto.serviceCategory.id,
        service_name: `${dto.serviceCategory.name} Service`,
        service_category: dto.serviceCategory.name,
        description: dto.problemDescription || null,
        image_url: dto.imageUrl || null,
        address: dto.address || 'Local Address',
        city: dto.city || 'Noida',
        urgency: dto.urgency,
        tier: dto.tier,
        estimated_price: estimatedPrice,
        connection_fee: connectionFee,
        total_price: totalPrice,
        worker_payout: workerPayout,
        status: 'REQUESTED' as const,
        otp: startOtp,
        payment_status: 'PENDING' as const,
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(insertData as unknown as Database['public']['Tables']['bookings']['Insert'])
        .select()
        .single();

      if (error || !data) throw error || new Error('Failed to insert booking');

      const createdBooking = mapRowToBooking(data as unknown as BookingRow, dto.worker);
      return { success: true, data: createdBooking };
    } catch (err: unknown) {
      console.warn('Supabase createBooking failed, falling back to local service:', err);
      return localBookingService.createBooking(dto);
    }
  }

  /**
   * Advance booking status
   */
  public async updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus,
    note?: string
  ): Promise<ApiResponse<Booking>> {
    if (!isSupabaseConfigured()) {
      return localBookingService.updateBookingStatus(bookingId, newStatus, note);
    }

    try {
      const updates: Partial<BookingRow> = {
        status: newStatus,
        completed_at: newStatus === 'COMPLETED' ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from('bookings')
        .update(updates as unknown as Database['public']['Tables']['bookings']['Update'])
        .eq('id', bookingId)
        .select()
        .single();

      if (error || !data) throw error || new Error('Failed to update booking status');

      return { success: true, data: mapRowToBooking(data as unknown as BookingRow) };
    } catch (err: unknown) {
      return localBookingService.updateBookingStatus(bookingId, newStatus, note);
    }
  }
}

export const supabaseBookingService = new SupabaseBookingService();
