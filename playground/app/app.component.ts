import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatIconRegistry } from '@angular/material/icon';

import { environment } from '../environments/environment';
import { FsExampleModule } from '@firestitch/example';
import { FirstExampleComponent } from './components/first-example/first-example.component';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsExampleModule, FirstExampleComponent],
})
export class AppComponent {
  public config = environment;

  private _iconRegistry = inject(MatIconRegistry);

  constructor() {
    this._iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
}
