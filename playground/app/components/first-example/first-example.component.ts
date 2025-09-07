import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';

import { MatButton } from '@angular/material/button';

import { FsApi } from '@firestitch/api';
import { FsFileModule } from '@firestitch/file';
import { FsImportComponent, FsImportConfig, FsImportModule } from '@firestitch/import';
import { FsMessage } from '@firestitch/message';

import { delay, map, tap } from 'rxjs/operators';


@Component({
  selector: 'first-example',
  templateUrl: './first-example.component.html',
  styleUrls: ['./first-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsFileModule,
    MatButton,
    FsImportModule,
    NgTemplateOutlet,
  ],
})
export class FirstExampleComponent implements OnInit {

  @ViewChild(FsImportComponent) 
  public fsImport: FsImportComponent;

  public url = 'https://specify.local.firestitch.com';
  public config: FsImportConfig;

  private _cdRef = inject(ChangeDetectorRef);
  private _api = inject(FsApi); 
  private _message = inject(FsMessage); 

  public ngOnInit() {
    this._api.get(`${this.url}/api/dummy/import/config`)
      .pipe(
        tap(({ config }) => {
          this.config = config;
          this._cdRef.markForCheck();
        }),
      )
      .subscribe();
  }

  public import(fsFile: any) {
    this.fsImport.import(
      this._api.post(`${this.url  }/api/dummy/import/result`, { file: fsFile.file })
        .pipe(
          delay(2000),
          map(({ result }) => result),
        ),
    );
  }

  public sample() {
    return this._api.download(null,'get',`${this.url}/api/dummy/import/sample`);
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
