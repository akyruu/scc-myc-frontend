import {NgModule} from '@angular/core';

import {RushSharedModule} from '../shared';
import {GroupComponent, GroupOverviewComponent, GroupVehicleComponent} from './components';
import {GroupRountingModule} from './group-rounting.module';

@NgModule({
  declarations: [
    GroupComponent,
    GroupOverviewComponent,
    GroupVehicleComponent,
  ],
  imports: [
    GroupRountingModule,
    RushSharedModule,
  ]
})
export class GroupModule {}
