export type TrainingStatus = "completed" | "in-progress" | "not-started";

export interface TrainingModule {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: TrainingStatus;
  duration: string;
  platform?: string;
}

export interface TrainingPeriod {
  id: string;
  name: string;
  modules: TrainingModule[];
}

export interface TrainingProgram {
  id: string;
  organizationId: string;
  name: string;
  periods: TrainingPeriod[];
}