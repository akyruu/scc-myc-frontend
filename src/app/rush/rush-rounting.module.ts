import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';

import {PlayerComponent, PlayerOverviewComponent, PlayerRucksackComponent, PlayerVehicleComponent, RushComponent} from './components';
import {RushGuard} from './guards';

const routes: Route[] = [{
  path: '',
  component: RushComponent,
  canActivate: [RushGuard],
  children: [{
    path: 'player',
    component: PlayerComponent,
    children: [
      {path: '', redirectTo: 'overview', pathMatch: 'full'},
      {path: 'overview', component: PlayerOverviewComponent},
      {path: 'rucksack', component: PlayerRucksackComponent},
      {path: 'vehicle', component: PlayerVehicleComponent},
    ]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [RushGuard]
})
export class RushRountingModule {}
