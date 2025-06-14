// Types
export interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

export interface ProcessedPage {
  title: string;
  url: string;
  description: string | null;
  section: string;
  priority: number;
  lastmod?: string;
}

export interface SectionData {
  name: string;
  pages: ProcessedPage[];
  priority: number;
}

export interface RequestBody {
  sitemapUrl: string;
  options?: {
    concurrency?: number;
    includePaths?: string[];
    excludePaths?: string[];
    customTitle?: string;
    customDescription?: string;
    priorityThreshold?: number;
  };
}

export interface ProgressUpdate {
  type: "progress";
  processed: number;
  total: number;
  message: string;
}

export interface ResultUpdate {
  type: "result";
  content: string;
}

export interface ErrorResponse {
  type: "error";
  message: string;
}

export type StreamResponse = ProgressUpdate | ResultUpdate | ErrorResponse;
