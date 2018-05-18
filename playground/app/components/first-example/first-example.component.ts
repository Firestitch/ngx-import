import { Component, OnInit } from '@angular/core';
import { FsApi } from '@firestitch/api';


@Component({
  selector: 'first-example',
  templateUrl: 'first-example.component.html'
})
export class FirstExampleComponent implements OnInit {

  public result = null;

  public config = null;

  constructor(private fsApi: FsApi) { }

  ngOnInit() {
    this.fsApi.get('https://boilerplate.firestitch.com/api/imports/config')
    .subscribe(response => {
      this.config = response['data'].config;
    });
  }

  select(fsFile) {
    this.fsApi.post('https://boilerplate.firestitch.com/api/imports/result', { file: fsFile.file })
    .subscribe(response => {
      this.result = response;
    });
  }
}
