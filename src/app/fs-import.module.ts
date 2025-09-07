import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsListModule } from '@firestitch/list';
import { FsMessageModule } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { FsImportComponent } from './components/import/import.component';
import { FsImportConfigContainerDirective } from './directives/import-config-container.directive';
import { FsImportResultContainerDirective } from './directives/import-result-container.directive';
import { KeysPipe } from './pipes/keys.pipe';
import { FsImportService } from './services/import.service';


@NgModule({
  imports: [
    CommonModule,
    FsListModule,
    FsMessageModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FsSkeletonModule,
    FsImportComponent,
    FsImportConfigContainerDirective,
    FsImportResultContainerDirective,
    KeysPipe,
  ],
  exports: [
    FsImportComponent,
    FsImportConfigContainerDirective,
    FsImportResultContainerDirective,
  ],
  providers: [
    FsImportService,
  ],
})
export class FsImportModule {
}
