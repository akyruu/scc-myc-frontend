import {NgModule} from '@angular/core';

import {SharedModule} from '../shared';
import {
  GroupEditDialogComponent,
  GroupsComponent,
  HomeComponent,
  JoinRoomDialogComponent,
  LobbyComponent,
  LobbyPlayersComponent,
  WelcomeComponent
} from './components';
import {LobbyDropListComponent} from './components/lobby/lobby-drop-list.component';
import {HomeRountingModule} from './home-rounting.module';

@NgModule({
  declarations: [
    HomeComponent,
    // Lobby
    LobbyComponent,
    LobbyDropListComponent,
    LobbyPlayersComponent,
    GroupsComponent,
    GroupEditDialogComponent,
    // Welcome
    JoinRoomDialogComponent,
    WelcomeComponent,
  ],
  imports: [
    HomeRountingModule,
    SharedModule,
  ],
  exports: [],
})
export class HomeModule {
}
