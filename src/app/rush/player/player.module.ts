import {NgModule} from '@angular/core';

import {RushSharedModule} from '../shared';
import {PlayerComponent, PlayerOverviewComponent, PlayerRucksackComponent, PlayerVehicleComponent} from './components';
import {PlayerRountingModule} from './player-rounting.module';

@NgModule({
  declarations: [
    PlayerComponent,
    PlayerOverviewComponent,
    PlayerRucksackComponent,
    PlayerVehicleComponent,
  ],
  imports: [
    PlayerRountingModule,
    RushSharedModule,
  ],
  providers: []
})
export class PlayerModule {}
