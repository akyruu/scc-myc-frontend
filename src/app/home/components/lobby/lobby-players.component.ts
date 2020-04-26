import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

import {AppContext, LobbyGroupSocket, LobbyRoomSocket} from '../../../core';
import {Room, RoomGroup, RoomUtils, SettingsUtils, Vehicle} from '../../../shared';

// TODO add rights managements

@Component({
  selector: 'app-lobby-players',
  templateUrl: './lobby-players.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyPlayersComponent {
  /* FIELDS ================================================================ */
  @Input() player: string;
  @Input() room: Room;
  @Input() leader: boolean;

  /* CONSTRUCTOR =========================================================== */
  constructor(private _lobbyGroupSocket: LobbyGroupSocket) {}

  /* METHODS =============================================================== */
  doDropPlayer(event: CdkDragDrop<any>): void {
    const player = event.item.data;

    // FIXME double check necessary for authorization, disabled doesn't work
    if (!this.leader && player !== this.player) {
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(this.room.players, event.previousIndex, event.currentIndex); // Ignored
    } else if (event.previousContainer) {
      const prevGroup = event.previousContainer.data;
      transferArrayItem(prevGroup.players, this.room.players, event.previousIndex, event.currentIndex);
      this._lobbyGroupSocket.removePlayer(player, prevGroup.name);
    } else if (event.container) {
      const group = event.container.data;
      transferArrayItem(this.room.players, group.players, event.previousIndex, event.currentIndex);
      this._lobbyGroupSocket.addPlayer(player, group.name);
    }
  }
}
