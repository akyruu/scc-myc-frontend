import {NgModule} from '@angular/core';

import {SharedModule} from '../shared';
import {
  PlayerComponent,
  PlayerOverviewComponent,
  PlayerRucksackComponent,
  PlayerVehicleComponent,
  RushComponent,
  RushInputItemComponent,
  RushLabelItemComponent,
  RushMenuComponent,
  RushSelectItemComponent
} from './components';
import {RushRountingModule} from './rush-rounting.module';
import {RushCalculator, RushContext} from './services';

@NgModule({
  declarations: [
    // Common
    RushInputItemComponent,
    RushLabelItemComponent,
    RushSelectItemComponent,
    // Player
    PlayerComponent,
    PlayerOverviewComponent,
    PlayerRucksackComponent,
    PlayerVehicleComponent,
    // Rush
    RushComponent,
    RushMenuComponent,
  ],
  imports: [
    RushRountingModule,
    SharedModule,
  ],
  providers: [
    RushContext,
    RushCalculator
  ]
})
export class RushModule {}
