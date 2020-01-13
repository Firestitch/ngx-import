import { Component, ViewChild } from '@angular/core';
import { FsApi } from '@firestitch/api';

import { FsMessage } from '@firestitch/message';
import { FsTransferService } from '@firestitch/transfer';
import { map } from 'rxjs/operators';


@Component({
  selector: 'first-example',
  templateUrl: 'first-example.component.html'
})
export class FirstExampleComponent {

  @ViewChild('fsImport', { static: true }) fsImport = null;

  public url = 'https://boilerplate.firestitch.com';

  constructor(private fsApi: FsApi, private fsMessage: FsMessage, private transfer: FsTransferService) { }

  config = () => {
    return this.fsApi.get(this.url + '/api/dummy/import/config')
      .pipe(
        map(response => response['data'].config),
      );
  };

  import(fsFile) {
    this.fsImport.import(
      this.fsApi.post(this.url + '/api/dummy/import/result', { file: fsFile.file })
        .pipe(
          map(response => response['data'].result),
        )
    )
  }

  sample() {
    return this.transfer.post(this.url + `/api/dummy/import/sample`);
  }

  reset() {
    this.fsImport.reset();
  }

  close() {
    this.fsMessage.success('Greetings, abstract dialog successfully closed');
  }

  cancel() {
    this.fsMessage.success('Import was canceled');
    this.fsImport.cancel();
  }
}
