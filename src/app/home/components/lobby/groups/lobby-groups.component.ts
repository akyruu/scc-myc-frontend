import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MediaObserver} from '@angular/flex-layout';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

import {GroupSocket} from '../../../../core';
import {Group, GroupUtils, Player, Rush, RushUtils} from '../../../../shared';
import {GroupEditData, GroupEditDialogComponent} from './group-edit-dialog.component';

interface GridListProps {
  cols: number;
  rowHeight: string | number;
}

@Component({
  selector: 'app-lobby-groups',
  templateUrl: './lobby-groups.component.html',
  styleUrls: ['./lobby-groups.component.scss']
})
export class LobbyGroupsComponent implements OnInit, OnDestroy {
  /* STATIC FIELDS ========================================================= */
  private static readonly COLS_BY_MEDIA = new Map<string, GridListProps>([
    ['xs', {cols: 1, rowHeight: '2:1'}],
    ['sm', {cols: 1, rowHeight: '4:3'}],
    ['md', {cols: 3, rowHeight: '4:4'}],
    ['lg', {cols: 4, rowHeight: '4:4'}],
    ['xl', {cols: 5, rowHeight: '4:4'}]
  ]);

  /* FIELDS ================================================================ */
  @Input() player: Player;
  @Input() rush: Rush;
  @Input() group: Group;

  gridListProps: GridListProps = {cols: 3, rowHeight: '3:3'};

  private _subscription: Subscription;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _dialog: MatDialog,
    private _mediaObserver: MediaObserver,
    private _translate: TranslateService,
    private _groupSocket: GroupSocket
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this._subscription = this._mediaObserver.asObservable().subscribe(() => {
      const media = Array.from(LobbyGroupsComponent.COLS_BY_MEDIA.keys())
        .find(m => this._mediaObserver.isActive(m));
      if (media) {
        this.gridListProps = LobbyGroupsComponent.COLS_BY_MEDIA.get(media);
      }
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  /* View ------------------------------------------------------------------ */
  isRushLeader(): boolean {
    return RushUtils.isLeader(this.rush, this.player.name);
  }

  isGroupLeader(group: Group): boolean {
    return GroupUtils.isLeader(group, this.player.name);
  }

  /* Events ---------------------------------------------------------------- */
  doNewGroup(): void {
    this._groupSocket.createGroup();
  }

  doEditGroup(group: Group, index: number): void {
    this._dialog.open(GroupEditDialogComponent, {
      data: <GroupEditData>{
        group: group,
        groupIndex: index,
        settings: this.rush.settings
      }
    });
  }

  doRemoveGroup(group: Group): void {
    this._groupSocket.removeGroup(group.index);
  }

  /* Player ---------------------------------------------------------------- */
  doAddPlayer(group: Group, player: Player): void {
    let prevGroup: Group;
    if (player === this.player) {
      prevGroup = this.group;
    } else if (!this.rush.players.includes(player)) {
      prevGroup = this.rush.groups.find(group => group.players.includes(player));
    }

    if (prevGroup) {
      this._groupSocket.switchPlayer(player.name, prevGroup.index, group.index);
    } else {
      this._groupSocket.addPlayer(player.name, group.index);
    }
  }
}
