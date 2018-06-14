import { Component, Input, ContentChild, ViewChild, TemplateRef, OnInit, OnChanges } from '@angular/core';

import { FsListConfig, FsListComponent } from '@firestitch/list';

import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/observable/of';

import { FsImportConfigFooterDirective, FsImportResultFooterDirective } from './../../directives';
import { FsImportService } from './../../services';
import { FsImportConfig, FsImportField, FsImportResult } from './../../interfaces';


@Component({
  selector: 'fs-import',
  templateUrl: './fs-import.component.html',
  styleUrls: [ './fs-import.component.scss' ]
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

  @ViewChild('listConfigEl')
  public listConfigEl: FsListComponent = null;
  public listConfig: FsListConfig = null;

  @ViewChild('listResultEl')
  public listResultEl: FsListComponent = null;
  public listResult: FsListConfig = null;

  @ContentChild(FsImportConfigFooterDirective, { read: TemplateRef })
    public configTemplate: FsImportConfigFooterDirective = null;

  @ContentChild(FsImportResultFooterDirective, { read: TemplateRef })
    public resultTemplate: FsImportResultFooterDirective = null;

  private $import: Subscriber<FsImportResult> = null;

  constructor(private fsImportService: FsImportService) { }

  ngOnInit() {
    this.listConfig = {
      status: false,
      paging: false,
      initialFetch: false,
      filters: [],
      actions: [],
      fetch: query => {
        return Observable.of({ data: this.configFields });
      }
    }

    this.listResult = {
      status: false,
      paging: false,
      initialFetch: false,
      filters: [],
      actions: [],
      fetch: query => {
        return Observable.of({ data: this.result.messages });
      }
    }
  }

  ngOnChanges() {
    if (!this.config) {
      return;
    }

    this.config().subscribe((response: FsImportConfig) => {
      this.fsImportService.setIterableConfigFields(response.fields);
      this.configFields = response.fields;
      this.listConfigEl.load();
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
        this.listResultEl.load();
      }
    },
    () => {
      this._mode = 'config';
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
