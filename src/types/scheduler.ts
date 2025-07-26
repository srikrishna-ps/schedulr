export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  remainingTime?: number;
}

export interface ExecutionBlock {
  processId: string;
  startTime: number;
  endTime: number;
}

export interface ProcessMetrics {
  id: string;
  arrivalTime: number;
  burstTime: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  priority?: number;
}

export interface SchedulingResult {
  executionOrder: ExecutionBlock[];
  processMetrics: ProcessMetrics[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
}

export type SchedulingAlgorithm = 'FCFS' | 'SJF' | 'SRTF' | 'Priority' | 'PriorityP' | 'RoundRobin';