import {NgModule} from '@angular/core';

import {RushOverviewComponent, RushService} from './core';
import {RushRountingModule} from './rush-rounting.module';
import {RushSharedModule} from './shared';

@NgModule({
  declarations: [
    RushOverviewComponent,
  ],
  imports: [
    RushSharedModule,
    RushRountingModule
  ],
  providers: [
    RushService
  ]
})
export class RushModule {}
