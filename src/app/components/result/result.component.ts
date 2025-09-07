import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';

import { FsListConfig, FsListModule } from '@firestitch/list';
import { FsMessageModule } from '@firestitch/message';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { of } from 'rxjs';

import { FsImportField } from 'src/app/interfaces/import-field.interface';

import { FsImportConfig } from '../../interfaces/import-config.interface';
import { FsImportResult } from '../../interfaces/import-result.interface';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsSkeletonModule,
    FsListModule,
    FsMessageModule,
    MatTab,
    MatTabGroup,
    MatTabContent,
    MatTabLabel,
  ],
})
export class FsResultComponent implements OnInit {

  @Input() public config: FsImportConfig;

  @Input() public result: FsImportResult = null;

  public failedListConfig: FsListConfig = null;
  public successListConfig: FsListConfig = null;
  public duplicateListConfig: FsListConfig = null;

  public get fields(): FsImportField[] {
    return this.config.fields;
  }

  public ngOnInit() {
    this.failedListConfig = this.createListConfig(this.result.fail.rows);
    this.successListConfig = this.createListConfig(this.result.success.rows);
    this.duplicateListConfig = this.createListConfig(this.result.duplicate.rows);
  }

  public createListConfig(rows: any[]): FsListConfig {
    return {
      status: false,
      paging: false,
      reload: false,
      fetch: () => {
        return of({ data: rows });
      },
    };
  }
}
