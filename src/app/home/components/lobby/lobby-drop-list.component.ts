import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, Input, OnDestroy, OnInit, Optional} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

import {AppContext, LobbyGroupSocket, LobbyRoomSocket} from '../../../core';
import {Room, RoomGroup, RoomUtils, SettingsUtils, Vehicle} from '../../../shared';

// TODO add rights managements

@Component({
  selector: 'app-lobby-drop-list',
  templateUrl: './lobby-drop-list.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyDropListComponent {
  /* FIELDS ================================================================ */
  @Input() players: string[];
  @Input() @Optional() group: RoomGroup;

  @Input() player: string;
  @Input() room: Room;

  /* CONSTRUCTOR =========================================================== */
  constructor(private _lobbyGroupSocket: LobbyGroupSocket) {}

  /* METHODS =============================================================== */
  get leader(): boolean {
    return this.room.leader === this.player || this.group?.leader === this.player;
  }

  /* Events ---------------------------------------------------------------- */
  doDropPlayer(event: CdkDragDrop<any>): void {
    const group = event.container.data;
    if (event.previousContainer === event.container) {
      moveItemInArray((group || this.room).players, event.previousIndex, event.currentIndex); // Ignored
    } else {
      const prevGroup = event.previousContainer.data;
      transferArrayItem((prevGroup || this.room).players, (group || this.room).players, event.previousIndex, event.currentIndex);

      const player = event.item.data;
      if (prevGroup) {
        if (group) {
          this._lobbyGroupSocket.switchPlayer(player, prevGroup.name, group.name);
        } else {
          this._lobbyGroupSocket.removePlayer(player, prevGroup.name);
        }
      } else if (group) {
        this._lobbyGroupSocket.addPlayer(player, group.name);
      }
    }
  }
}
