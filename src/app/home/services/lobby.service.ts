import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {AppContext, GroupSocket, RushSocket} from '../../core';
import {Group, GroupUtils, Player, Rush, RushUtils, SettingsUtils} from '../../shared';

@Injectable()
export class LobbyService {
  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _router: Router,
    private _appContext: AppContext,
    private _lobbyGroupSocket: GroupSocket,
    private _lobbyRushSocket: RushSocket,
  ) {}

  /* METHODS =============================================================== */
  get player(): Player {
    return this._appContext.player;
  }

  get rush(): Rush {
    return this._appContext.rush;
  }

  get group(): Group {
    return this._appContext.group.value;
  }

  set group(group: Group) {
    this._appContext.group.next(group);
  }

  bindRushEvents(): Subscription[] {
    return [
      this._lobbyRushSocket.playerJoined.subscribe(player => this.rush.players.push(player)),
      this._lobbyRushSocket.playerLeaved.subscribe(playerName => RushUtils.deletePlayer(this.rush, playerName)),
      this._lobbyRushSocket.rushLaunched.subscribe(() => {
        this.rush.launched = true;

        const route: any[] = ['/rush'];
        if (!RushUtils.isLeader(this.rush, this.player.name)) {
          if (this.group) {
            route.push('group', RushUtils.findGroupIndex(this.rush, this.group.index));
            if (!GroupUtils.isLeader(this.group, this.player.name)) {
              route.push('player', GroupUtils.findPlayerIndex(this.group, this.player.name));
            }
          } else {
            route.push('player', RushUtils.findPlayerIndex(this.rush, this.player.name));
          }
        }
        this._router.navigate(route).then();
      })
    ];
  };

  bindGroupEvents(): Subscription[] {
    return [
      this._lobbyGroupSocket.groupCreated.subscribe(group => this.rush.groups.push(group)),
      this._lobbyGroupSocket.groupPropsUpdated.subscribe(data => {
        const group = RushUtils.findGroup(this.rush, data.groupIndex);
        if (data.updatedProps.name !== undefined) {
          group.name = data.updatedProps.name;
        }
        if (data.updatedProps.vehicleName !== undefined) {
          group.vehicle = data.updatedProps.vehicleName ?
            SettingsUtils.findVehicle(this.rush.settings, data.updatedProps.vehicleName)
            : undefined;
        }
        if (data.updatedProps.leaderName !== undefined) {
          group.leader = data.updatedProps.leaderName ?
            GroupUtils.findPlayer(group, data.updatedProps.leaderName)
            : undefined;
        }
      }),
      this._lobbyGroupSocket.groupRemoved.subscribe(groupName => {
        const group = RushUtils.deleteGroup(this.rush, groupName);
        if (group) {
          this.rush.players.push(...group.players);
        }
      })
    ];
  }

  bindPlayerEvents(): Subscription[] {
    return [
      this._lobbyGroupSocket.playerAdded.subscribe(data => {
        const group = RushUtils.findGroup(this.rush, data.groupIndex);
        const player = RushUtils.deletePlayer(this.rush, data.playerName);
        if (player) { // Check already executed
          group.players.push(player);
          if (player.name === this.player.name) {
            this.group = group;
          }
        }
      }),
      this._lobbyGroupSocket.playerRemoved.subscribe(data => {
        const group = RushUtils.findGroup(this.rush, data.groupIndex);
        const player = GroupUtils.deletePlayer(group, data.playerName);
        if (player) { // Check already executed
          this.rush.players.push(player);
          if (player.name === this.player.name) {
            this.group = null;
          }
        }
      }),
      this._lobbyGroupSocket.playerSwitched.subscribe(data => {
        const oldGroup = RushUtils.findGroup(this.rush, data.oldGroupIndex);
        const newGroup = RushUtils.findGroup(this.rush, data.newGroupIndex);
        const player = GroupUtils.deletePlayer(oldGroup, data.playerName);
        if (player) { // Check already executed
          newGroup.players.push(player);
          if (player.name === this.player.name) {
            this.group = newGroup;
          }
        }
      })
    ];
  }
}
