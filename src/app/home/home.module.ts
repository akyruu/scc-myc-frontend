import {NgModule} from '@angular/core';

import {SharedModule} from '../shared';
import {
  GroupEditDialogComponent,
  GroupsComponent,
  JoinRushDialogComponent,
  LaunchRushDialogComponent,
  LobbyComponent,
  LobbyDropListComponent,
  LobbyPlayersComponent,
  WelcomeComponent
} from './components';
import {HomeRountingModule} from './home-rounting.module';
import {LobbyService} from './services';

@NgModule({
  declarations: [
    // Lobby
    LobbyComponent,
    LobbyDropListComponent,
    LobbyPlayersComponent,
    GroupsComponent,
    GroupEditDialogComponent,
    // Welcome
    JoinRushDialogComponent,
    LaunchRushDialogComponent,
    WelcomeComponent,
  ],
  imports: [
    HomeRountingModule,
    SharedModule,
  ],
  providers: [
    LobbyService
  ]
})
export class HomeModule {}
