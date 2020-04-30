import {NgModule} from '@angular/core';

import {SharedModule} from '../../shared';
import {
  BoxesOverviewComponent,
  RushContainerComponent,
  RushInputItemComponent,
  RushLabelItemComponent,
  RushSelectItemComponent,
  VehicleCargoComponent,
  VehicleCargoOverviewComponent
} from './components';

@NgModule({
  declarations: [
    // Box
    BoxesOverviewComponent,
    // Common
    RushContainerComponent,
    RushInputItemComponent,
    RushLabelItemComponent,
    RushSelectItemComponent,
    // Vehicle
    VehicleCargoComponent,
    VehicleCargoOverviewComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    // Components
    RushInputItemComponent,
    RushLabelItemComponent,
    RushSelectItemComponent,
    RushContainerComponent,
    VehicleCargoComponent,
    VehicleCargoOverviewComponent,
    BoxesOverviewComponent,
  ]
})
export class RushSharedModule {}
