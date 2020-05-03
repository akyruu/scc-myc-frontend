import {CdkDragDrop, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, Input, Optional} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

import {AppContext, GroupSocket} from '../../../../core';
import {Group, GroupUtils, Player, RushUtils} from '../../../../shared';

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

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _appContext: AppContext,
    private _lobbyGroupSocket: GroupSocket
  ) {}

  /* METHODS =============================================================== */
  getColor(player: Player): ThemePalette { // FIXME duplicated code with group-overview
    if (player.name === this._appContext.player.name) {
      return 'primary';
    } else if (this.group && GroupUtils.isLeader(this.group, player.name)) {
      return 'accent';
    } else if (RushUtils.isLeader(this._appContext.rush, player.name)) {
      return 'warn';
    }
    return undefined;
  }

  isMovable(player: Player): boolean {
    return player.name === this._appContext.player.name
      || (this.group && GroupUtils.isLeader(this.group, this._appContext.player.name))
      || RushUtils.isLeader(this._appContext.rush, this._appContext.player.name);
  }

  isRemovable(player: Player): boolean {
    return this.group && this.isMovable(player);
  }

  /* Events ---------------------------------------------------------------- */
  doDropPlayer(event: CdkDragDrop<Group>): void {
    const group = event.container.data;
    if (event.previousContainer !== event.container) {
      const prevGroup = event.previousContainer.data;
      transferArrayItem(
        (prevGroup || this._appContext.rush).players, (group || this._appContext.rush).players,
        event.previousIndex, event.currentIndex
      );

      const player = <Player>event.item.data;
      if (prevGroup) {
        if (group) {
          this._lobbyGroupSocket.switchPlayer(player.name, prevGroup.index, group.index);
        } else {
          this._lobbyGroupSocket.removePlayer(player.name, prevGroup.index);
        }
      } else if (group) {
        this._lobbyGroupSocket.addPlayer(player.name, group.index);
      }

      if (player.name === this._appContext.player.name) {
        this._appContext.group.next(group);
      }
    }
  }

  doRemovePlayer(player: Player, index: number) {
    this.group.players.splice(index, 1);
    this._appContext.rush.players.push(player);
    this._lobbyGroupSocket.removePlayer(player.name, this.group.index);
  }
}
