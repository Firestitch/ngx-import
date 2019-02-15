import { Injectable } from '@angular/core';

import { FsImportField } from './../interfaces/import-field.interface';


@Injectable()
export class FsImportService {

  constructor() {}

  public setIterableConfigFields(fields: FsImportField[]): void {
    for (const field of fields) {
      const validators = [];
      for (const key in field.validations) {

        if (!field.validations[key]) {
          continue;
        }

        validators.push({ key: key, value: field.validations[key] });
      }
      field.validationsArray = validators;
    }
  }
}
