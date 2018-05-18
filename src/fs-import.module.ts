import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';

import { FsListModule } from '@firestitch/list';

import { FsImportConfigComponent, FsImportResultComponent } from './components';
import { FsImportService } from './services';


@NgModule({
  imports: [
    CommonModule,
    FsListModule,
    MatIconModule
  ],
  exports: [
    FsImportConfigComponent,
    FsImportResultComponent
  ],
  entryComponents: [
  ],
  declarations: [
    FsImportConfigComponent,
    FsImportResultComponent
  ],
  providers: [
    FsImportService
  ],
})
export class FsImportModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsImportModule,
      providers: [FsImportService]
    };
  }
}
