import { Component, Input, ViewChild, OnInit, OnChanges } from '@angular/core';

import { FsListConfig, FsListComponent } from '@firestitch/list';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { FsImportService } from './../../services';
import { FsImportConfig } from './../../interfaces';


@Component({
  selector: 'fs-import-config',
  templateUrl: './fs-import-config.component.html',
  styleUrls: [ './fs-import-config.component.scss' ]
})
export class FsImportConfigComponent implements OnInit, OnChanges {

  @Input() public config: FsImportConfig = null;

  @ViewChild('listConfigEl')
  public listConfigEl: FsListComponent = null;

  public listConfig: FsListConfig = null;

  constructor(private fsImportService: FsImportService) { }

  ngOnInit() {
    this.listConfig = {
      status: false,
      paging: false,
      initialFetch: false,
      filters: [],
      actions: [],
      fetch: query => {

        this.fsImportService.setIterableConfigFields(this.config.fields);

        return Observable.of({ data: this.config.fields });
      }
    }
  }

  ngOnChanges() {
    if (!this.config) {
      return;
    }

    // Data populating to the list without async queries. List has no enough time to init.
    // @TODO looking for better pattern to load list without timeout
    setTimeout(() => {
      this.listConfigEl.load();
    });
  }
}
