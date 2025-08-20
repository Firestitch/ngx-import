import { FsMessage } from '@firestitch/message';
import { FsStore } from '@firestitch/store';
import { FsTransferHandler, Request } from '@firestitch/transfer';


export class TransferHandler extends FsTransferHandler {

  constructor(private fsMessage: FsMessage, private fsStore: FsStore) {
    super();
  }

  public begin(request: Request) {
    this.fsMessage.info('Starting download...');

    return request;
  }

  error(data, raw) {
    const message = data && data.message ? data.message : 'There was a problem with the download';
    this.fsMessage.error(message);
  }
}
