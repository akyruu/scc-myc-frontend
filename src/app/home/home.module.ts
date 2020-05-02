import {NgModule} from '@angular/core';

import {SharedModule} from '../shared';
import {
  GroupEditDialogComponent,
  JoinRushDialogComponent,
  LaunchSoloRushDialogComponent,
  LobbyComponent,
  LobbyDropListComponent,
  LobbyGroupsComponent,
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
    LobbyGroupsComponent,
    GroupEditDialogComponent,
    // Welcome
    JoinRushDialogComponent,
    LaunchSoloRushDialogComponent,
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
