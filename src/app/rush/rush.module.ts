import {NgModule} from '@angular/core';

import {SharedModule} from '../shared';
import {PlayerBoxComponent, PlayerComponent, PlayerOverviewComponent, RushComponent} from './components';
import {RushRountingModule} from './rush-rounting.module';

@NgModule({
  declarations: [
    RushComponent,
    // Player
    PlayerComponent,
    PlayerBoxComponent,
    PlayerOverviewComponent,
  ],
  imports: [
    RushRountingModule,
    SharedModule,
  ],
  providers: []
})
export class RushModule {}
