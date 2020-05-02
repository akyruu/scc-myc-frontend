import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';

import {GroupComponent, GroupOverviewComponent, GroupVehicleComponent} from './components';
import {GroupPlayerResolve} from './resolvers';

const routes: Route[] = [{
  path: '',
  component: GroupComponent,
  children: [
    {path: '', redirectTo: 'overview', pathMatch: 'full'},
    {path: 'overview', component: GroupOverviewComponent},
    {path: 'vehicle', component: GroupVehicleComponent},
    {
      path: 'player/:index',
      loadChildren: () => import('../player/player.module').then(m => m.PlayerModule),
      resolve: {player: GroupPlayerResolve}
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [GroupPlayerResolve]
})
export class GroupRountingModule {}
