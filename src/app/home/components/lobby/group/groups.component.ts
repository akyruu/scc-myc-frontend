import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MediaObserver} from '@angular/flex-layout';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

import {LobbyGroupSocket} from '../../../../core';
import {Room, RoomGroup} from '../../../../shared';
import {GroupEditData, GroupEditDialogComponent} from './group-edit-dialog.component';

interface GridListProps {
  cols: number;
  rowHeight: string | number;
}

@Component({
  selector: 'app-lobby-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['../lobby.component.scss', './groups.component.scss']
})
export class GroupsComponent implements OnInit, OnDestroy {
  /* STATIC FIELDS ========================================================= */
  private static readonly COLS_BY_MEDIA = new Map<string, GridListProps>([
    ['xs', {cols: 1, rowHeight: '2:1'}],
    ['sm', {cols: 1, rowHeight: '4:3'}],
    ['md', {cols: 3, rowHeight: '4:4'}],
    ['lg', {cols: 4, rowHeight: '4:4'}],
    ['xl', {cols: 5, rowHeight: '4:4'}]
  ]);

  /* FIELDS ================================================================ */
  @Input() player: string;
  @Input() room: Room;
  @Input() group: RoomGroup;

  gridListProps: GridListProps = {cols: 3, rowHeight: '3:3'};

  private _subscription: Subscription;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _dialog: MatDialog,
    private _mediaObserver: MediaObserver,
    private _translate: TranslateService,
    private _lobbyGroupSocket: LobbyGroupSocket
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this._subscription = this._mediaObserver.asObservable().subscribe(() => {
      const media = Array.from(GroupsComponent.COLS_BY_MEDIA.keys())
        .find(m => this._mediaObserver.isActive(m));
      if (media) {
        this.gridListProps = GroupsComponent.COLS_BY_MEDIA.get(media);
      }
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  /* Events ---------------------------------------------------------------- */
  doNewGroup(): void {
    const groupName = this._translate.instant('home.lobby.group.name', {index: this.room.groups.length + 1});
    this._lobbyGroupSocket.createGroup(groupName);
  }

  doEditGroup(group: RoomGroup, index: number): void {
    this._dialog.open(GroupEditDialogComponent, {
      data: <GroupEditData>{
        group: group,
        groupIndex: index,
        groupName: group.name,
        vehicleName: group.vehicle?.name,
        settings: this.room.settings
      }
    });
  }

  doRemoveGroup(group: RoomGroup): void {
    this._lobbyGroupSocket.removeGroup(group.name);
  }

  /* Player ---------------------------------------------------------------- */
  doAddPlayer(group: RoomGroup, player: string): void {
    let prevGroup: RoomGroup;
    if (player === this.player) {
      prevGroup = this.group;
    } else if (!this.room.players.includes(player)) {
      prevGroup = this.room.groups.find(group => group.players.includes(player));
    }

    if (prevGroup) {
      this._lobbyGroupSocket.switchPlayer(player, prevGroup.name, group.name);
    } else {
      this._lobbyGroupSocket.addPlayer(player, group.name);
    }
  }
}
