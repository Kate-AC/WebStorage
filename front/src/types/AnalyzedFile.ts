export type AnalyzedFile = {
  dataSet: string[];
  fileKey: string;
  fileName: string;
  fileSize: number;
  divisionNumber: number;
  executionCount: number;
  status: 'initialized' | 'running' | 'completed';
  transferInitialized: () => void;
  transferRunning: () => void;
  transferCompleted: () => void;
  progress: () => number;
};
