import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  OnChanges,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { FsMessage } from '@firestitch/message';

import { Observable, of, Subscriber } from 'rxjs';

import { FsImportConfigFooterDirective } from '../../directives/import-config-footer.directive';
import { FsImportResultFooterDirective } from '../../directives/import-result-footer.directive';
import { FsImportService } from '../../services/import.service';
import { FsImportField } from '../../interfaces/import-field.interface';
import { FsImportConfig } from '../../interfaces/import-config.interface';
import { FsImportResult } from '../../interfaces/import-result.interface';


@Component({
  selector: 'fs-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsImportComponent implements OnInit, OnChanges {

  @Input() public config: () => Observable<FsImportConfig> = null;

  public result: FsImportResult = null;
  public configFields: FsImportField[] = [];
  public resultHasError = false;

  private _mode = 'config';

  get mode() {
    return this._mode;
  }

  @ViewChild('listConfigEl', { static: true })
  public listConfigEl: FsListComponent = null;
  public listConfig: FsListConfig = null;

  @ViewChild('listResultEl', { static: true })
  public listResultEl: FsListComponent = null;
  public listResult: FsListConfig = null;

  @ContentChild(FsImportConfigFooterDirective, { read: TemplateRef, static: false })
  public configTemplate: FsImportConfigFooterDirective = null;

  @ContentChild(FsImportResultFooterDirective, { read: TemplateRef, static: false })
  public resultTemplate: FsImportResultFooterDirective = null;

  private $import: Subscriber<FsImportResult> = null;

  constructor(
    private fsImportService: FsImportService,
    private fsMessage: FsMessage,
    private cdRef: ChangeDetectorRef,
  ) {
  }

  public ngOnInit() {
    this.listConfig = {
      status: false,
      paging: false,
      fetch: query => {
        return of({ data: this.configFields });
      }
    };

    this.listResult = {
      status: false,
      paging: false,
      fetch: query => {
        return of({ data: this.result.messages });
      }
    }
  }

  public ngOnChanges() {
    if (!this.config) {
      return;
    }

    this.config().subscribe((response: FsImportConfig) => {
      this.fsImportService.setIterableConfigFields(response.fields);
      this.configFields = response.fields;
      this.listConfigEl.reload();

      this.cdRef.markForCheck();
    });
  }

  public import(import$) {

    this._mode = 'processing';
    this.resultHasError = false;

    this.$import = import$
      .subscribe(result => {
          this.result = result;
          this.resultHasError = !!(this.result.duplicate.count || this.result.fail.count);
          this._mode = 'result';

          if (this.listResultEl) {
            this.listResultEl.reload();
          }

          this.cdRef.markForCheck();
        },
        response => {
          this._mode = 'config';
          this.fsMessage.error(response.error.message);
          this.cdRef.markForCheck();
        });
  }

  public reset() {
    this.result = null;
    this._mode = 'config';
    this.resultHasError = false;
  }

  public cancel() {
    if (this.$import) {
      this.reset();
      this.$import.unsubscribe();
    }
  }
}
