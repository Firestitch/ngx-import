import { Component, Input, ViewChild, KeyValueDiffers, OnInit, OnChanges, DoCheck } from '@angular/core';

import { FsListConfig, FsListComponent } from '@firestitch/list';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { FsImportResult } from './../../interfaces';


@Component({
  selector: 'fs-import-result',
  templateUrl: './fs-import-result.component.html',
  styleUrls: [ './fs-import-result.component.scss' ],
})
export class FsImportResultComponent implements OnInit, DoCheck {

  @Input() public result: FsImportResult = null;

  @ViewChild('listResultEl')
  public listResultEl: FsListComponent = null;

  public listConfig: FsListConfig = null;

  private _differ = null;

  constructor(private _differs: KeyValueDiffers) {
    this._differ = this._differs.find({}).create();
  }

  ngOnInit() {
    this.listConfig = {
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

  ngDoCheck() {
    const changes = this._differ.diff(this.result);

    if (this.listResultEl && changes) {
      // Data populating to the list without async queries. List has no enough time to init.
      // @TODO looking for better pattern to load list without timeout
      setTimeout(() => {
        this.listResultEl.load();
      });
    }
  }
}
