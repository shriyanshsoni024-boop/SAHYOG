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
            onUpdate(payload.new as unknown as Partial<Booking>);
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
            onNewDispatch(payload.new as unknown as Booking);
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
