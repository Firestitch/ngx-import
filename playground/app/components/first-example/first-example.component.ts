import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { FsApi } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';
import { FsTransferService } from '@firestitch/transfer';

import { map } from 'rxjs/operators';


@Component({
  selector: 'first-example',
  templateUrl: './first-example.component.html',
  styleUrls: ['./first-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstExampleComponent {

  @ViewChild('fsImport', { static: true }) 
  public fsImport = null;

  public url = 'https://specify.firestitch.dev';

  constructor(
    private _api: FsApi, 
    private _message: FsMessage, 
    private _transfer: FsTransferService,
  ) { }

  public config = () => {
    return this._api.get(`${this.url}/api/dummy/import/config`)
      .pipe(
        map(({ config }) => config),
      );
  };

  public import(fsFile: any) {
    this.fsImport.import(
      this._api.post(`${this.url  }/api/dummy/import/result`, { file: fsFile.file })
        .pipe(
          map((result) => result),
        ),
    );
  }

  public sample() {
    return this._transfer.post(`${this.url  }/api/dummy/import/sample`);
  }

  public reset() {
    this.fsImport.reset();
  }

  public close() {
    this._message.success('Greetings, abstract dialog successfully closed');
  }

  public cancel() {
    this._message.success('Import was canceled');
    this.fsImport.cancel();
  }
}
