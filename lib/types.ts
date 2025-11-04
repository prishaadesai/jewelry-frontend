// lib/types.ts
export interface Job {
  id: number;
  design_no: string;
  item_category: string;
  initial_weight: number;
  total_loss: number;
  loss_percentage: number;
  status: string;
  current_stage: string | null;
  current_worker_id: number | null;
  created_at: string;
  created_by: number;
  description: string | null;
}

export interface Transaction {
  id: number;
  job_id: number;
  worker_id: number;
  stage: string;
  issued_weight: number;
  returned_weight: number | null;
  loss: number | null;
  loss_percentage: number | null;
  issued_at: string;
  returned_at: string | null;
  status: string;
  notes: string | null;
}

export interface JobDetail extends Job {
  transactions: Transaction[];
}

export interface WorkerTask {
  transaction_id: number;
  job_id: number;
  design_no: string;
  item_category: string;
  stage: string;
  issued_weight: number;
  issued_at: string;
}

export interface WorkerPerformance {
  worker_id: number;
  worker_name: string;
  role: string;
  total_jobs: number;
  total_loss: number;
  average_loss_percentage: number;
}

export interface JobSummary {
  total_jobs: number;
  completed_jobs: number;
  in_progress_jobs: number;
  pending_jobs: number;
  total_initial_weight: number;
  total_loss: number;
  average_loss_percentage: number;
}

export interface MaterialConsumption {
  item_category: string;
  total_jobs: number;
  total_initial_weight: number;
  total_loss: number;
  loss_percentage: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}
