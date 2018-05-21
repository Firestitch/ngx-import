import { FsTransferHandler } from '@firestitch/transfer';
import { FsMessage } from '@firestitch/message';
import { FsStore } from '@firestitch/store';


export class TransferHandler extends FsTransferHandler {

  constructor(private fsMessage: FsMessage, private fsStore: FsStore) {
    super();
  }

  begin(params) {
    this.fsMessage.info('Starting download...');
  }

  error(data, raw) {
    const message = data && data.message ? data.message : 'There was a problem with the download';
    this.fsMessage.error(message);
  }
}
