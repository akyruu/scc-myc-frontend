import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, Input, Optional} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

import {LobbyGroupSocket} from '../../../../core';
import {Group, GroupUtils, Player, Rush, RushUtils} from '../../../../shared';

// TODO add rights managements

@Component({
  selector: 'app-lobby-drop-list',
  templateUrl: './lobby-drop-list.component.html',
  styleUrls: ['./lobby-drop-list.component.scss']
})
export class LobbyDropListComponent {
  /* FIELDS ================================================================ */
  @Input() players: Player[];
  @Input() @Optional() group: Group;

  @Input() player: Player;
  @Input() rush: Rush;

  /* CONSTRUCTOR =========================================================== */
  constructor(private _lobbyGroupSocket: LobbyGroupSocket) {}

  /* METHODS =============================================================== */
  getColor(player: Player): ThemePalette {
    if (player.name === this.player.name) {
      return 'primary';
    } else if (this.group && GroupUtils.isLeader(this.group, player.name)) {
      return 'accent';
    } else if (RushUtils.isLeader(this.rush, player.name)) {
      return 'warn';
    }
    return undefined;
  }

  isMovable(player: Player): boolean {
    return player.name === this.player.name
      || (this.group && GroupUtils.isLeader(this.group, this.player.name))
      || RushUtils.isLeader(this.rush, this.player.name);
  }

  isRemovable(player: Player): boolean {
    return this.group && this.isMovable(player);
  }

  /* Events ---------------------------------------------------------------- */
  doDropPlayer(event: CdkDragDrop<Group>): void {
    const group = event.container.data;
    if (event.previousContainer === event.container) {
      moveItemInArray((group || this.rush).players, event.previousIndex, event.currentIndex); // Ignored
    } else {
      const prevGroup = event.previousContainer.data;
      transferArrayItem((prevGroup || this.rush).players, (group || this.rush).players, event.previousIndex, event.currentIndex);

      const player: Player = event.item.data;
      if (prevGroup) {
        if (group) {
          this._lobbyGroupSocket.switchPlayer(player.name, prevGroup.name, group.name);
        } else {
          this._lobbyGroupSocket.removePlayer(player.name, prevGroup.name);
        }
      } else if (group) {
        this._lobbyGroupSocket.addPlayer(player.name, group.name);
      }
    }
  }

  doRemovePlayer(player: Player, index: number) {
    this.group.players.splice(index, 1);
    this.rush.players.push(player);
    this._lobbyGroupSocket.removePlayer(player.name, this.group.name);
  }
}
