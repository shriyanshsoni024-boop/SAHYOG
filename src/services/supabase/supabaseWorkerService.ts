import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Worker, WorkerAvailability, WorkerEarningsRecord, ApiResponse } from '../../types';
import { workerService as localWorkerService } from '../workerService';
import { Database } from '../../types/database';

type WorkerRow = Database['public']['Tables']['workers']['Row'];
type WorkerEarningsRow = Database['public']['Tables']['worker_earnings']['Row'];

const mapRowToWorker = (row: WorkerRow): Worker => {
  return {
    id: row.id,
    name: row.name,
    nameHi: row.name_hi || row.name,
    phone: row.phone,
    avatar: row.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
    professions: row.professions,
    skills: row.skills,
    experienceYears: row.experience_years,
    experienceLevel: row.experience_level,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    completedJobs: row.completed_jobs,
    distanceKm: Number(row.distance_km),
    availability: row.availability,
    emergencyAvailable: row.emergency_ready,
    verificationStatus: row.verification_status,
    cooperativeName: row.cooperative_branch,
    zone: row.zone,
    aadhaarNumber: row.aadhaar_masked || undefined,
    certificates: (Array.isArray(row.certificates_data) ? row.certificates_data : []) as Worker['certificates'],
    trainingCompleted: row.training_completed,
  };
};

export class SupabaseWorkerService {
  /**
   * Fetch all registered workers
   */
  public async getWorkers(): Promise<ApiResponse<Worker[]>> {
    if (!isSupabaseConfigured()) {
      return localWorkerService.getWorkers();
    }

    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;

      const rows = (data || []) as unknown as WorkerRow[];
      const workers = rows.map(mapRowToWorker);
      return { success: true, data: workers };
    } catch (err: unknown) {
      console.warn('Supabase getWorkers failed, falling back to local:', err);
      return localWorkerService.getWorkers();
    }
  }

  /**
   * Update worker availability duty toggle
   */
  public async updateWorkerAvailability(
    workerId: string,
    availability: WorkerAvailability,
    emergencyAvailable?: boolean
  ): Promise<ApiResponse<Worker>> {
    if (!isSupabaseConfigured()) {
      return localWorkerService.updateWorkerAvailability(workerId, availability, emergencyAvailable);
    }

    try {
      const updates: Partial<WorkerRow> = { availability };
      if (emergencyAvailable !== undefined) {
        updates.emergency_ready = emergencyAvailable;
      }

      const { data, error } = await supabase
        .from('workers')
        .update(updates as unknown as Database['public']['Tables']['workers']['Update'])
        .eq('id', workerId)
        .select()
        .single();

      if (error || !data) throw error || new Error('Worker update failed');

      return { success: true, data: mapRowToWorker(data as unknown as WorkerRow) };
    } catch (err: unknown) {
      return localWorkerService.updateWorkerAvailability(workerId, availability, emergencyAvailable);
    }
  }

  /**
   * Fetch worker earnings records from Supabase
   */
  public async getWorkerEarnings(workerId?: string): Promise<ApiResponse<WorkerEarningsRecord[]>> {
    if (!isSupabaseConfigured()) {
      return localWorkerService.getWorkerEarnings(workerId);
    }

    try {
      let query = supabase.from('worker_earnings').select('*').order('created_at', { ascending: false });
      if (workerId) {
        query = query.eq('worker_id', workerId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const rows = (data || []) as unknown as WorkerEarningsRow[];
      const records: WorkerEarningsRecord[] = rows.map((row) => ({
        id: row.id,
        bookingToken: row.booking_token,
        serviceName: row.service_name,
        customerName: row.customer_name,
        date: new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        amount: row.amount,
        platformFee: row.platform_fee,
        netPayout: row.net_payout,
        status: row.status,
      }));

      return { success: true, data: records };
    } catch (err: unknown) {
      return localWorkerService.getWorkerEarnings(workerId);
    }
  }
}

export const supabaseWorkerService = new SupabaseWorkerService();
