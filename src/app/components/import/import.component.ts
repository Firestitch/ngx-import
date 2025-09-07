import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { MatIcon } from '@angular/material/icon';

import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';
import { FsProcess } from '@firestitch/process';

import { finalize, Observable, of, tap } from 'rxjs';

import { FsImportConfigContainerDirective } from '../../directives/import-config-container.directive';
import { FsImportResultContainerDirective } from '../../directives/import-result-container.directive';
import { ImportMode } from '../../enums/import-mode.enum';
import { FsImportConfig } from '../../interfaces/import-config.interface';
import { FsImportField } from '../../interfaces/import-field.interface';
import { FsImportResult } from '../../interfaces/import-result.interface';
import { NanoXlsxWriter } from '../../lib/nono-writer/nano-writer';
import { KeysPipe } from '../../pipes/keys.pipe';
import { FsImportService } from '../../services/import.service';
import { FsResultComponent } from '../result';


@Component({
  selector: 'fs-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsListModule,
    MatIcon,
    NgTemplateOutlet,
    KeysPipe,
    FsResultComponent,
  ],
})
export class FsImportComponent implements OnInit {

  @Input() public config: FsImportConfig;

  @Input()
  public hidePreviewColumn: boolean;

  public result: FsImportResult = null;
  public configFields: FsImportField[] = [];
  public ImportMode = ImportMode;

  public get processing() {
    return this._processing;
  }

  public get mode() {
    return this._mode;
  }

  public get modeConfig() {
    return this._mode === ImportMode.Config;
  }

  public get modeResult() {
    return this._mode === ImportMode.Result;
  }

  @ViewChild(FsListComponent, { static: true })
  public listConfigEl: FsListComponent = null;
  public listConfig: FsListConfig = null;

  @ContentChild(FsImportConfigContainerDirective, { read: TemplateRef })
  public configContainerTemplate: TemplateRef<any>;

  @ContentChild(FsImportResultContainerDirective, { read: TemplateRef })
  public resultContainerTemplate: TemplateRef<any>;

  private _mode: ImportMode = ImportMode.Config;
  private _fsImportService = inject(FsImportService);
  private _process = inject(FsProcess);
  private _cdRef = inject(ChangeDetectorRef);
  private _processing = false;

  public ngOnInit() {
    this._fsImportService.setIterableConfigFields(this.config.fields);
    this.configFields = this.config.fields;
    this._cdRef.markForCheck();

    this.listConfig = {
      status: false,
      paging: false,
      reload: false,
      fetch: () => {
        return of({ data: this.configFields });
      },
    };
  }

  public import(import$: Observable<FsImportResult>) {
    this._processing = true;
    this._cdRef.markForCheck();
    this._process.run('Processing import',   
      import$
        .pipe(
          tap((result: FsImportResult) => {
            this.result = result;
            this._mode = ImportMode.Result;   
            this._cdRef.markForCheck();
          }),
          finalize(() => {
            this._processing = false;
            this._cdRef.markForCheck();
          }),
        ));
  }

  public downloadResult() {
    const sheets = [];
    if(this.result.fail.rows.length > 0) {
      sheets.push({
        name: 'Failed',
        data: this._getSheetData(this.result.fail.rows, true),
      });
    }
    
    if(this.result.success.rows.length > 0) {
      sheets.push({
        name: 'Success',
        data: this._getSheetData(this.result.success.rows),
      });
    }
    
    if(this.result.duplicate.rows.length > 0) {
      sheets.push({
        name: 'Duplicate',
        data: this._getSheetData(this.result.duplicate.rows),
      });
    }

    const writer = new NanoXlsxWriter({
      sheets,
      fileName: 'importresult.xlsx',
    });
    writer.save();
  }

  public reset() {
    this.result = null;
    this._mode = ImportMode.Config;
    this._cdRef.markForCheck();
  }

  public cancel() {
    this.reset();
  }

  private _getSheetData(
    rows: {rowNumber: number; data: any; messages: string[] }[], 
    showMessage: boolean = false,
  ) {
    return [
      [
        ...(showMessage ? ['Reason'] : []),
        ...this.configFields.map((field) => {
          return field.name;
        }),
      ],
      ...rows.map((row) => {
        return [
          ...(showMessage ? [row.messages.join(', ')] : []),
          ...row.data,
        ];
      }),
    ];
  }
}
