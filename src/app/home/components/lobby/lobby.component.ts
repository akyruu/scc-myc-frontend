import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

import {AppContext, LobbyGroupSocket, LobbyRoomSocket} from '../../../core';
import {Room, RoomGroup, RoomUtils, SettingsUtils} from '../../../shared';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit, OnDestroy {
  /* FIELDS ================================================================ */
  player: string;
  room: Room;
  group: RoomGroup;
  leader: boolean;

  editGroupIndex: number = -1;
  editGroupName: string;

  private readonly _subscriptions: Subscription[] = [];

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _translate: TranslateService,
    private _appContext: AppContext,
    private _lobbyGroupSocket: LobbyGroupSocket,
    private _lobbyRoomSocket: LobbyRoomSocket,
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.player = this._appContext.player.value;
    this.room = this._appContext.room.value;
    this.group = this._appContext.group.value;
    this.leader = this.room.leader === this.player;

    this._subscriptions.push(...[
      // Room
      this._lobbyRoomSocket.playerJoined.subscribe(player => this.room.players.push(player)),
      this._lobbyRoomSocket.playerLeaved.subscribe(player =>
        this.room.players.splice(this.room.players.indexOf(player), 1)),
      // Group
      this._lobbyGroupSocket.groupCreated.subscribe(group => this.room.groups.push(group)),
      this._lobbyGroupSocket.groupPropsUpdated.subscribe(data => {
        const group = RoomUtils.findGroup(this.room, data.groupName);
        if (data.updatedProps.name !== undefined) {
          group.name = data.updatedProps.name;
        }
        if (data.updatedProps.vehicleName !== undefined) {
          group.vehicle = data.updatedProps.vehicleName ? SettingsUtils.findVehicle(this.room.settings, data.updatedProps.vehicleName) : undefined;
        }
      }),
      this._lobbyGroupSocket.groupRemoved.subscribe(groupName =>
        this.room.groups.splice(this.room.groups.findIndex(group => group.name = groupName), 1)),
      // Player
      this._lobbyGroupSocket.playerAdded.subscribe(data => {
        const playerIndex = this.room.players.indexOf(data.player);
        if (playerIndex >= 0) { // Check already executed
          this.room.players.splice(playerIndex, 1);

          const group = RoomUtils.findGroup(this.room, data.groupName);
          group.players.push(data.player);

          if (data.player === this.player) {
            this.group = group;
          }
        }
      }),
      this._lobbyGroupSocket.playerRemoved.subscribe(data => {
        const group = RoomUtils.findGroup(this.room, data.groupName);
        const playerIndex = group.players.indexOf(data.player);
        if (playerIndex >= 0) { // Check already executed
          group.players.splice(playerIndex, 1);
          this.room.players.push(data.player);

          if (data.player === this.player) {
            this.group = null;
          }
        }
      }),
      this._lobbyGroupSocket.playerSwitched.subscribe(data => {
        const oldGroup = RoomUtils.findGroup(this.room, data.oldGroupName);
        const playerIndex = oldGroup.players.indexOf(data.player);
        if (playerIndex >= 0) { // Check already executed
          oldGroup.players.splice(playerIndex, 1);

          const newGroup = RoomUtils.findGroup(this.room, data.newGroupName);
          newGroup.players.push(data.player);

          if (data.player === this.player) {
            this.group = newGroup;
          }
        }
      })
    ]);
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
