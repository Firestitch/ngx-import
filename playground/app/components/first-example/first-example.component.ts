import { Component, ViewChild, OnInit } from '@angular/core';
import { FsApi } from '@firestitch/api';

import { FsMessage } from '@firestitch/message';
import { FsTransferService } from '@firestitch/transfer';


@Component({
  selector: 'first-example',
  templateUrl: 'first-example.component.html'
})
export class FirstExampleComponent implements OnInit {

  @ViewChild('fsImport') fsImport = null;

  constructor(private fsApi: FsApi, private fsMessage: FsMessage, private transfer: FsTransferService) { }

  ngOnInit() {
  }

  config = () => {
    return this.fsApi.get('https://boilerplate.firestitch.com/api/imports/config')
      .map(response => response['data'].config);
  }

  import(fsFile) {
    this.fsImport.import(
      this.fsApi.post('https://boilerplate.firestitch.com/api/imports/result', { file: fsFile.file })
        .map(response => response['data'].result)
    );
  }

  sample() {
    return this.transfer.post(`https://boilerplate.firestitch.com/api/imports/sample`);
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
