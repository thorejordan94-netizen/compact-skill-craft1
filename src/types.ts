export interface JobProfile {
  id: string;
  title: string;
  description: string;
}

export interface RoomMetadata {
  summary: string;
  description: string;
  difficulty: string;
  tags: string[];
  tools: string[];
  mainCategory: string;
  environment: string;
  keyTakeaways: string;
  timeEstimate: string;
  type?: string;
  releaseDate?: string;
}

export interface CareerRelevance {
  jobId: string;
  score: number;
  reason: string;
}

export interface RoomData {
  id: string;
  name: string;
  status: 'idle' | 'queued' | 'analyzing' | 'complete' | 'error';
  metadata?: RoomMetadata;
  analysis?: CareerRelevance[];
  url?: string;
}

export interface AnalysisResponseSchema {
  metadata: RoomMetadata;
  analysis: {
    windowsClient: { score: number; reason: string };
    windowsServer: { score: number; reason: string };
    network: { score: number; reason: string };
    dba: { score: number; reason: string };
    linux: { score: number; reason: string };
  };
}

export type ViewMode = 'grid' | 'list';
export type SortKey = 'name' | 'score' | 'difficulty';
export type SortDir = 'asc' | 'desc';

export interface FilterState {
  search: string;
  difficulties: string[];
  categories: string[];
  includeTags: string[];
  excludeTags: string[];
  includeTools: string[];
  excludeTools: string[];
  statusFilter: 'all' | 'analyzed' | 'pending';
}

export interface AppState {
  rooms: RoomData[];
  viewMode: ViewMode;
  sortKey: SortKey;
  sortDir: SortDir;
  selectedRoomId: string | null;
  selectedJobId: string | null;
  isCompact: boolean;
}
