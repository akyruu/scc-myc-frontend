import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';

import {LobbyComponent, WelcomeComponent} from './components';
import {LobbyGuard} from './guards';

const routes: Route[] = [
  {path: '', redirectTo: 'welcome', pathMatch: 'full'},
  {path: 'lobby', component: LobbyComponent, canActivate: [LobbyGuard]},
  {path: 'welcome', component: WelcomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [LobbyGuard]
})
export class HomeRountingModule {}
