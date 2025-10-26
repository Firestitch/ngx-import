import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { FsStore, FsStoreModule } from '@firestitch/store';
import { FsTransferService, FS_TRANSFER_HANDLER, FsTransferModule } from '@firestitch/transfer';
import { TransferHandler } from './app/handlers/transfer.handler';
import { FsMessage, FsMessageModule } from '@firestitch/message';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { FsImportModule } from '@firestitch/import';
import { FsFileModule } from '@firestitch/file';
import { FsSelectionModule } from '@firestitch/selection';
import { FsPromptModule } from '@firestitch/prompt';
import { FsApiModule } from '@firestitch/api';
import { FsExampleModule } from '@firestitch/example';
import { FsListModule } from '@firestitch/list';
import { FsScrollModule } from '@firestitch/scroll';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, FsImportModule, FsStoreModule, FsFileModule.forRoot(), FsMessageModule.forRoot(), FsSelectionModule, FsPromptModule, FsTransferModule, FsApiModule, FsExampleModule.forRoot(), FsListModule.forRoot(), FsScrollModule.forRoot()),
        FsStore,
        FsTransferService,
        {
            provide: FS_TRANSFER_HANDLER,
            useClass: TransferHandler,
            deps: [FsMessage, FsStore],
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        provideRouter([])
    ]
})
  .catch(err => console.error(err));

