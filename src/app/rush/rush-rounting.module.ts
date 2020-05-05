import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';

import {RushGroupResolve, RushGuard, RushOverviewComponent, RushPlayerResolve} from './core';

const groupLoader = () => import('./group/group.module').then(m => m.GroupModule);
const playerLoader = () => import('./player/player.module').then(m => m.PlayerModule);

const routes: Route[] = [{
  path: '',
  canActivate: [RushGuard],
  canDeactivate: [RushGuard],
  children: [
    {path: '', redirectTo: 'overview', pathMatch: 'full'},
    {path: 'group/:index', loadChildren: groupLoader, resolve: {group: RushGroupResolve}},
    {path: 'overview', component: RushOverviewComponent},
    {path: 'player/:index', loadChildren: playerLoader, resolve: {player: RushPlayerResolve}},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    RushGroupResolve,
    RushGuard,
    RushPlayerResolve
  ]
})
export class RushRountingModule {}
