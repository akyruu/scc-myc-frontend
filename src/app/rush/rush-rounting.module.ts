import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';

import {MyGroupResolve, MyPlayerResolve, RushGuard, RushOverviewComponent} from './core';

const routes: Route[] = [{
  path: '',
  canActivate: [RushGuard],
  children: [
    {path: '', redirectTo: 'overview', pathMatch: 'full'},
    {path: 'overview', component: RushOverviewComponent},
    {path: 'my-group', loadChildren: () => import('./group/group.module').then(m => m.GroupModule), resolve: {group: MyGroupResolve}},
    {path: 'my-player', loadChildren: () => import('./player/player.module').then(m => m.PlayerModule), resolve: {player: MyPlayerResolve}}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    MyGroupResolve,
    MyPlayerResolve,
    RushGuard
  ]
})
export class RushRountingModule {}
