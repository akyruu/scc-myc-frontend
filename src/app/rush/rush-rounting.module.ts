import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';

import {PlayerBoxComponent, PlayerComponent, PlayerOverviewComponent, RushComponent} from './components';
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
      {path: 'box', component: PlayerBoxComponent},
      {path: 'overview', component: PlayerOverviewComponent}
    ]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [RushGuard]
})
export class RushRountingModule {}
