export interface FsImportField {
  name: string;
  description?: string;
  validations: {
    [key: string]: boolean | string[];
  };
  validationsArray: object[];
}
