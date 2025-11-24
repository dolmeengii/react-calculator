export interface WorkerRequest {
  input: string;
}

export interface WorkerResponse {
  result: number | null;
  duration: number;
  error?: string;
}
