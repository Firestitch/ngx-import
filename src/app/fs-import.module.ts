import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FsListModule } from '@firestitch/list';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsMessageModule } from '@firestitch/message';

import { FsImportComponent } from './components/import/import.component';
import { KeysPipe } from './pipes/keys.pipe';
import { FsImportConfigFooterDirective } from './directives/import-config-footer.directive';
import { FsImportResultFooterDirective } from './directives/import-result-footer.directive';
import { FsImportService } from './services/import.service';


@NgModule({
    imports: [
        CommonModule,
        FsListModule,
        FsMessageModule,
        MatIconModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        FsSkeletonModule
    ],
    exports: [
        FsImportComponent,
        FsImportConfigFooterDirective,
        FsImportResultFooterDirective
    ],
    declarations: [
        FsImportComponent,
        FsImportConfigFooterDirective,
        FsImportResultFooterDirective,
        KeysPipe
    ],
    providers: [
        FsImportService
    ]
})
export class FsImportModule {
  static forRoot(): ModuleWithProviders<FsImportModule> {
    return {
      ngModule: FsImportModule,
      providers: [FsImportService]
    };
  }
}
