import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';

import {PlayerComponent, PlayerOverviewComponent, PlayerRucksackComponent, PlayerVehicleComponent} from './components';

const routes: Route[] = [{
  path: '',
  component: PlayerComponent,
  children: [
    {path: '', redirectTo: 'overview', pathMatch: 'full'},
    {path: 'overview', component: PlayerOverviewComponent},
    {path: 'rucksack', component: PlayerRucksackComponent},
    {path: 'vehicle', component: PlayerVehicleComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerRountingModule {}
