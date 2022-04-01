import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsStoreModule, FsStore } from '@firestitch/store';
import { FsFileModule } from '@firestitch/file';
import { FsTransferModule, FS_TRANSFER_HANDLER, FsTransferService } from '@firestitch/transfer';
import { FsApiModule } from '@firestitch/api';
import { FsMessage, FsMessageModule } from '@firestitch/message';
import { FsImportModule } from '@firestitch/import';
import { FsSelectionModule } from '@firestitch/selection';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppMaterialModule } from './material.module';
import { FirstExampleComponent } from './components/first-example/first-example.component';
import { TransferHandler } from './handlers/transfer.handler';
import { FsPromptModule } from '@firestitch/prompt';
import { FsScrollModule } from '@firestitch/scroll';
import { FsListModule } from '@firestitch/list';


@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }),
    FsImportModule,
    FsStoreModule,
    FsFileModule.forRoot(),
    FsMessageModule.forRoot(),
    FsSelectionModule,
    FsPromptModule,
    FsTransferModule,
    FsApiModule,
    FsExampleModule.forRoot(),
    FsListModule.forRoot(),
    FsScrollModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),

  ],
  entryComponents: [
  ],
  declarations: [
    AppComponent,
    FirstExampleComponent
  ],
  providers: [
    FsStore,
    FsTransferService,
    {
      provide: FS_TRANSFER_HANDLER,
      useClass: TransferHandler,
      deps: [ FsMessage, FsStore ]
    }
  ],
})
export class PlaygroundModule {
}
