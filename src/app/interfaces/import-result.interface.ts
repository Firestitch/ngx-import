export interface FsImportResult {
  duplicate?: {
    count?: number;
    message?: string;
    rows?: {rowNumber: number; data: any; messages: string[] }[];
  }
  fail?: {
    count?: number;
    message?: string;
    rows?: {rowNumber: number; data: any; messages: string[] }[];
  }
  success?: {
    count?: number;
    message?: string;
    rows?: {rowNumber: number; data: any; messages: string[] }[];
  }
  messages?: any[];
}
