import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';

import {GroupComponent, GroupOverviewComponent, GroupVehicleComponent} from './components';

const routes: Route[] = [{
  path: '',
  component: GroupComponent,
  children: [
    {path: '', redirectTo: 'overview', pathMatch: 'full'},
    {path: 'overview', component: GroupOverviewComponent},
    {path: 'vehicle', component: GroupVehicleComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRountingModule {}
