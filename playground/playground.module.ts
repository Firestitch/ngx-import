import './../tools/assets/playground.scss';

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
import { FsMessage } from '@firestitch/message';

import { AppComponent } from './app/app.component';
import { FsImportModule } from '../src';
import { AppMaterialModule } from './app/material.module';
import { FirstExampleComponent } from './app/components/first-example/first-example.component';
import { TransferHandler } from './app/handlers/transfer.handler';


@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    RouterModule.forRoot([]),
    FsImportModule,
    FsExampleModule,
    FsStoreModule,
    FsFileModule,
    FsTransferModule,
    FsApiModule
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
