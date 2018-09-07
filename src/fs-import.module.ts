import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatProgressSpinnerModule } from '@angular/material';

import { FsListModule } from '@firestitch/list';
import { FsScrollModule } from '@firestitch/scroll';
import { FsMessageModule } from '@firestitch/message';

import { FsImportComponent } from './components';
import { KeysPipe } from './pipes/keys.pipe';
import { FsImportConfigFooterDirective, FsImportResultFooterDirective } from './directives';
import { FsImportService } from './services';


@NgModule({
  imports: [
    CommonModule,
    FsListModule.forRoot(),
    FsScrollModule.forRoot(),
    FsMessageModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  exports: [
    FsImportComponent,
    FsImportConfigFooterDirective,
    FsImportResultFooterDirective
  ],
  entryComponents: [
  ],
  declarations: [
    FsImportComponent,
    FsImportConfigFooterDirective,
    FsImportResultFooterDirective,
    KeysPipe
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
