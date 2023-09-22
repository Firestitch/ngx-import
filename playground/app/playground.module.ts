import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { FsApiModule } from '@firestitch/api';
import { FsExampleModule } from '@firestitch/example';
import { FsFileModule } from '@firestitch/file';
import { FsImportModule } from '@firestitch/import';
import { FsMessage, FsMessageModule } from '@firestitch/message';
import { FsSelectionModule } from '@firestitch/selection';
import { FsStore, FsStoreModule } from '@firestitch/store';
import { FS_TRANSFER_HANDLER, FsTransferModule, FsTransferService } from '@firestitch/transfer';

import { FsListModule } from '@firestitch/list';
import { FsPromptModule } from '@firestitch/prompt';
import { FsScrollModule } from '@firestitch/scroll';
import { AppComponent } from './app.component';
import { FirstExampleComponent } from './components/first-example/first-example.component';
import { TransferHandler } from './handlers/transfer.handler';
import { AppMaterialModule } from './material.module';


@NgModule({
  bootstrap: [AppComponent],
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
      deps: [FsMessage, FsStore]
    }
  ],
})
export class PlaygroundModule {
}
