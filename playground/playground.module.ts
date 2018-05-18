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
import { FsTransferModule } from '@firestitch/transfer';
import { FS_TRANSFER_HANDLER, FsTransferService } from '@firestitch/transfer';
import { FsApiModule } from '@firestitch/api';

import { AppComponent } from './app/app.component';
import { FsImportModule } from '../src';
import { AppMaterialModule } from './app/material.module';
import { FirstExampleComponent } from './app/components/first-example/first-example.component';


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
    FsStore
  ],
})
export class PlaygroundModule {
}
