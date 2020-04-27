import {NgModule} from '@angular/core';

import {SharedModule} from '../shared';
import {RushComponent} from './components';
import {RushRountingModule} from './rush-rounting.module';

@NgModule({
  declarations: [
    RushComponent,
  ],
  imports: [
    RushRountingModule,
    SharedModule,
  ],
  providers: []
})
export class RushModule {}
