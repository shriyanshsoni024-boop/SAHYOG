import { Worker, WorkerAvailability, WorkerEarningsRecord, TrainingModule, SkillItem, WorkerCertificate, ApiResponse } from '../types';
import { STORAGE_KEYS } from './storage/storageKeys';
import { storageService } from './storage/storageService';
import { MOCK_WORKERS } from '../data/workers';
import { TRAINING_MODULES, INITIAL_SKILLS_MATRIX, MOCK_EARNINGS_HISTORY } from '../data/workerTrainingData';

class WorkerService {
  /**
   * Fetch all registered workers
   */
  public async getWorkers(): Promise<ApiResponse<Worker[]>> {
    try {
      const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
      return { success: true, data: workers };
    } catch (err) {
      return { success: false, error: 'Failed to retrieve workers' };
    }
  }

  /**
   * Fetch single worker profile
   */
  public async getWorkerById(workerId: string): Promise<ApiResponse<Worker>> {
    try {
      const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
      const worker = workers.find(w => w.id === workerId) || workers[0];
      if (!worker) {
        return { success: false, error: `Worker ${workerId} not found` };
      }
      return { success: true, data: worker };
    } catch (err) {
      return { success: false, error: 'Failed to fetch worker profile' };
    }
  }

  /**
   * Update worker profile data
   */
  public async updateWorker(workerId: string, updates: Partial<Worker>): Promise<ApiResponse<Worker>> {
    try {
      const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
      const index = workers.findIndex(w => w.id === workerId);
      if (index === -1) {
        return { success: false, error: `Worker ${workerId} not found` };
      }

      const updated = { ...workers[index], ...updates };
      workers[index] = updated;
      storageService.setItem(STORAGE_KEYS.WORKERS, workers);

      return { success: true, data: updated, message: 'Worker profile updated successfully.' };
    } catch (err) {
      return { success: false, error: 'Failed to update worker' };
    }
  }

  /**
   * Update availability & emergency duty toggle
   */
  public async updateWorkerAvailability(
    workerId: string,
    availability: WorkerAvailability,
    emergencyAvailable?: boolean
  ): Promise<ApiResponse<Worker>> {
    const updates: Partial<Worker> = { availability };
    if (emergencyAvailable !== undefined) {
      updates.emergencyAvailable = emergencyAvailable;
    }
    return this.updateWorker(workerId, updates);
  }

  /**
   * Fetch worker earnings ledger
   */
  public async getWorkerEarnings(_workerId?: string): Promise<ApiResponse<WorkerEarningsRecord[]>> {
    try {
      const earnings = storageService.getItem<WorkerEarningsRecord[]>(
        STORAGE_KEYS.EARNINGS,
        MOCK_EARNINGS_HISTORY
      );
      return { success: true, data: earnings };
    } catch (err) {
      return { success: false, error: 'Failed to retrieve earnings' };
    }
  }

  /**
   * Add a new completed job record to the earnings ledger
   */
  public async addEarningsRecord(
    record: Omit<WorkerEarningsRecord, 'id'>,
    workerId: string = 'w-1'
  ): Promise<ApiResponse<WorkerEarningsRecord>> {
    try {
      const newRecord: WorkerEarningsRecord = {
        id: `ern-${Date.now()}`,
        ...record,
      };

      const earnings = storageService.getItem<WorkerEarningsRecord[]>(
        STORAGE_KEYS.EARNINGS,
        MOCK_EARNINGS_HISTORY
      );
      const updatedEarnings = [newRecord, ...earnings];
      storageService.setItem(STORAGE_KEYS.EARNINGS, updatedEarnings);

      // Increment completed jobs on worker
      const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
      const wIdx = workers.findIndex(w => w.id === workerId);
      if (wIdx !== -1) {
        workers[wIdx] = {
          ...workers[wIdx],
          completedJobs: workers[wIdx].completedJobs + 1,
        };
        storageService.setItem(STORAGE_KEYS.WORKERS, workers);
      }

      return { success: true, data: newRecord, message: 'Earnings ledger updated.' };
    } catch (err) {
      return { success: false, error: 'Failed to add earnings record' };
    }
  }

  /**
   * Fetch training modules
   */
  public async getTrainingModules(): Promise<ApiResponse<TrainingModule[]>> {
    try {
      const modules = storageService.getItem<TrainingModule[]>(
        STORAGE_KEYS.TRAINING_MODULES,
        TRAINING_MODULES
      );
      return { success: true, data: modules };
    } catch (err) {
      return { success: false, error: 'Failed to fetch training modules' };
    }
  }

  /**
   * Fetch skills matrix
   */
  public async getSkillsMatrix(): Promise<ApiResponse<SkillItem[]>> {
    try {
      const skills = storageService.getItem<SkillItem[]>(
        STORAGE_KEYS.SKILLS_MATRIX,
        INITIAL_SKILLS_MATRIX
      );
      return { success: true, data: skills };
    } catch (err) {
      return { success: false, error: 'Failed to fetch skills matrix' };
    }
  }

  /**
   * Fetch certificates
   */
  public async getCertificates(): Promise<ApiResponse<WorkerCertificate[]>> {
    try {
      const certs = storageService.getItem<WorkerCertificate[]>(STORAGE_KEYS.CERTIFICATES, []);
      return { success: true, data: certs };
    } catch (err) {
      return { success: false, error: 'Failed to fetch certificates' };
    }
  }

  /**
   * Submit quiz results, update skill level, and generate verifiable certificate
   */
  public async submitQuizAndGenerateCert(
    moduleId: string,
    score: number,
    workerId: string = 'w-1'
  ): Promise<ApiResponse<WorkerCertificate>> {
    try {
      const modules = storageService.getItem<TrainingModule[]>(
        STORAGE_KEYS.TRAINING_MODULES,
        TRAINING_MODULES
      );
      const targetModule = modules.find(m => m.id === moduleId);
      const profession = targetModule?.profession || 'General Technician';
      const certNum = `SYH-NSDC-2026-${profession.substring(0, 2).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;

      const workers = storageService.getItem<Worker[]>(STORAGE_KEYS.WORKERS, MOCK_WORKERS);
      const currentWorker = workers.find(w => w.id === workerId) || workers[0];

      const newCert: WorkerCertificate = {
        id: `cert-${Date.now()}`,
        certificateNumber: certNum,
        workerName: currentWorker.name,
        profession,
        skills: targetModule ? [targetModule.title] : ['Certified Vocational Skill'],
        score,
        issueDate: 'Today (Verified)',
        expiryDate: '3 Years Validity',
        issuer: 'National Worker Cooperative Federation & NSDC Skills Council',
        isDemo: true,
      };

      // 1. Mark training module as completed
      const updatedModules = modules.map(m =>
        m.id === moduleId ? { ...m, completed: true, score } : m
      );
      storageService.setItem(STORAGE_KEYS.TRAINING_MODULES, updatedModules);

      // 2. Add certificate to list
      const certs = storageService.getItem<WorkerCertificate[]>(STORAGE_KEYS.CERTIFICATES, []);
      storageService.setItem(STORAGE_KEYS.CERTIFICATES, [newCert, ...certs]);

      // 3. Update skills matrix
      const skills = storageService.getItem<SkillItem[]>(
        STORAGE_KEYS.SKILLS_MATRIX,
        INITIAL_SKILLS_MATRIX
      );
      const updatedSkills = skills.map(s => {
        if (s.profession.toLowerCase() === profession.toLowerCase()) {
          return {
            ...s,
            verified: true,
            trainingRequired: false,
            level: 'Certified Master' as const,
            certificateNumber: certNum,
          };
        }
        return s;
      });
      storageService.setItem(STORAGE_KEYS.SKILLS_MATRIX, updatedSkills);

      // 4. Update worker profile certifications & training
      const wIdx = workers.findIndex(w => w.id === workerId);
      if (wIdx !== -1) {
        workers[wIdx] = {
          ...workers[wIdx],
          trainingCompleted: Array.from(
            new Set([...workers[wIdx].trainingCompleted, targetModule?.title || ''])
          ),
          certificates: [
            ...workers[wIdx].certificates,
            {
              title: targetModule?.title || `${profession} Certified`,
              issuer: 'SAHYOG Cooperative Federation',
              issuedYear: 2026,
              certificateNumber: certNum,
            },
          ],
        };
        storageService.setItem(STORAGE_KEYS.WORKERS, workers);
      }

      return {
        success: true,
        data: newCert,
        message: `Certificate ${certNum} generated and verified.`,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to complete quiz and generate certificate',
      };
    }
  }
}

export const workerService = new WorkerService();
