export interface FsImportResult {
  duplicate?: {
    count?: number;
    message?: string;
  }
  fail?: {
    count?: number;
    message?: string;
  }
  success?: {
    count?: number;
    message?: string;
  }
  messages?: any[];
}
