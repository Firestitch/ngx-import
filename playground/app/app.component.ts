import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatIconRegistry } from '@angular/material/icon';

import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public config = environment;

  private _iconRegistry = inject(MatIconRegistry);

  constructor() {
    this._iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
}
