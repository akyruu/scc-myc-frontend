import {NgModule} from '@angular/core';

import {RushOverviewComponent} from './core';
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
  providers: []
})
export class RushModule {}
