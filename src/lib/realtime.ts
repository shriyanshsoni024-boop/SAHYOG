import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { Booking } from '../types';

export type BookingUpdateCallback = (updatedBooking: Partial<Booking>) => void;
export type DispatchEventCallback = (newBooking: Booking) => void;

/**
 * Realtime Foundation Helper for SAHYOG
 * Enables instant multi-device event propagation across Customer, Worker, and Admin phones.
 */
class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();

  /**
   * Subscribe to live state updates for a specific booking (Used by Customer Tracking screen)
   */
  public subscribeToBooking(
    bookingId: string,
    onUpdate: BookingUpdateCallback
  ): () => void {
    if (!isSupabaseConfigured() || !bookingId) {
      // Graceful no-op when running in standalone demo / local mode
      return () => {};
    }

    const channelName = `booking_updates_${bookingId}`;
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${bookingId}`,
        },
        (payload) => {
          if (payload.new) {
            const raw = payload.new as any;
            const updated: Partial<Booking> = {
              id: raw.id,
              token: raw.token,
              status: raw.status,
              paymentStatus: raw.payment_status,
              completedAt: raw.completed_at || undefined,
              customerRating: raw.customer_rating ? Number(raw.customer_rating) : undefined,
              customerReview: raw.customer_review || undefined,
              workerRating: raw.worker_rating ? Number(raw.worker_rating) : undefined,
              workerReview: raw.worker_review || undefined,
              otp: raw.otp,
            };
            onUpdate(updated);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to new incoming dispatches for workers in a specific zone or trade
   */
  public subscribeToWorkerDispatches(
    workerId: string,
    onNewDispatch: DispatchEventCallback
  ): () => void {
    if (!isSupabaseConfigured() || !workerId) {
      return () => {};
    }

    const channelName = `worker_dispatches_${workerId}`;
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          if (payload.new) {
            const raw = payload.new as any;
            const newBooking: Partial<Booking> = {
              id: raw.id,
              token: raw.token,
              customerId: raw.customer_id,
              customerName: raw.customer_name,
              customerPhone: raw.customer_phone,
              serviceId: raw.service_id,
              serviceName: raw.service_name,
              serviceCategory: raw.service_category,
              description: raw.description,
              imageUrl: raw.image_url,
              address: raw.address,
              city: raw.city,
              scheduledDate: raw.scheduled_date,
              scheduledTime: raw.scheduled_time,
              urgency: raw.urgency,
              tier: raw.tier,
              estimatedPrice: raw.estimated_price,
              connectionFee: raw.connection_fee,
              totalPrice: raw.total_price,
              status: raw.status,
              otp: raw.otp,
              paymentStatus: raw.payment_status,
              createdAt: raw.created_at,
              statusHistory: [
                {
                  status: raw.status,
                  timestamp: new Date(raw.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  note: 'New dispatch request',
                },
              ],
            };
            onNewDispatch(newBooking as Booking);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  /**
   * Unsubscribe from a specific realtime channel
   */
  public unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  /**
   * Clean up all active realtime listeners
   */
  public cleanup(): void {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }
}

export const realtimeService = new RealtimeService();
