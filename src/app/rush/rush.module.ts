import {NgModule} from '@angular/core';

import {SharedModule} from '../shared';
import {
  PlayerComponent,
  PlayerOverviewComponent,
  PlayerRucksackComponent,
  PlayerVehicleComponent,
  RushComponent,
  RushMenuComponent
} from './components';
import {RushRountingModule} from './rush-rounting.module';
import {RushService} from './services';

@NgModule({
  declarations: [
    RushComponent,
    RushMenuComponent,
    // Player
    PlayerComponent,
    PlayerOverviewComponent,
    PlayerRucksackComponent,
    PlayerVehicleComponent,
  ],
  imports: [
    RushRountingModule,
    SharedModule,
  ],
  providers: [RushService]
})
export class RushModule {}
