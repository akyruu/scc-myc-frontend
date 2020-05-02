import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {map} from 'rxjs/operators';

import {Group, Harvest, Ore, Player, Rush, RushUtils, Settings, Vehicle} from '../../shared';

@Injectable({providedIn: 'root'})
export class LobbyRushSocket {
  /* FIELDS ================================================================ */
  readonly playerJoined = this._socket.fromEvent<Player>('lobby:rush:playerJoined')
    .pipe(map(player => Object.assign(new Player(), player)));
  readonly playerLeaved = this._socket.fromEvent<string>('lobby:rush:playerLeaved');

  readonly rushLaunched = this._socket.fromEvent<void>('lobby:rush:launched');

  /* CONSTRUCTOR =========================================================== */
  constructor(private _socket: Socket) {}

  /* METHODS =============================================================== */
  /**
   * Create a new rush and join it.
   * The player is the leader of this rush.
   *
   * @param playerName Player's name (leader).
   * @param single Single rush (one player only).
   */
  async createRush(playerName: string, single: boolean): Promise<{ player: Player, rush: Rush }> {
    this._socket.emit('lobby:rush:create', {playerName: playerName, single: single});

    const result = await this._socket.fromOneTimeEvent<{ player: Player, rush: Rush }>('lobby:rush:created');
    this._bindRush(result);
    return result;
  }

  /**
   * Join an existing rush. The player must be unique.
   *
   * @param playerName Player's name.
   * @param rushUuid Identifier of rush to join.
   */
  async joinRush(playerName: string, rushUuid: string): Promise<{ player: Player, rush: Rush }> {
    this._socket.emit('lobby:rush:join', {playerName: playerName, rushUuid: rushUuid});

    const result = await this._socket.fromOneTimeEvent<{ player: Player, rush: Rush }>('lobby:rush:joined');
    this._bindRush(result);
    return result;
  }

  private _bindRush(data: { rush: Rush, player: Player }): void {
    data.player = Object.assign(new Player(), data.player);

    data.rush = Object.assign(new Rush(), data.rush);
    data.rush.settings = this._bindSettings(data.rush.settings);
    this._bindPlayers(data.rush.players, data.player);
    this._bindGroups(data.rush.groups, data.player);
    data.rush.leader = this._bindPlayer(data.rush.leader, ...data.rush.players);

    if (data.rush.leader) {
      data.rush.leader = RushUtils.findPlayer(data.rush, data.rush.leader.name);
    }
  }

  private _bindGroups(groups: Group[], myPlayer: Player): void {
    for (let i = 0; i < groups.length; i++) {
      const group = Object.assign(groups[i]);
      this._bindPlayers(group.players, myPlayer);
      group.leader = this._bindPlayer(group.leader, ...group.players);
      groups[i] = group;
    }
  }

  private _bindPlayers(players: Player[], myPlayer: Player): void {
    for (let i = 0; i < players.length; i++) {
      players[i] = this._bindPlayer(players[i], myPlayer);
    }
  }

  private _bindPlayer(data: Player, ...players: Player[]): Player {
    let player = players.find(p => p.name === data.name);
    return player || Object.assign(new Player(), data);
  }

  private _bindSettings(data: Settings): Settings {
    const settings = Object.assign(new Settings(), data);
    for (let i = 0; i < settings.harvests.length; i++) {
      settings.harvests[i] = Object.assign(new Harvest(), settings.harvests[i]);
    }
    for (let i = 0; i < settings.ores.length; i++) {
      settings.ores[i] = Object.assign(new Ore(), settings.ores[i]);
    }
    for (let i = 0; i < settings.vehicles.length; i++) {
      settings.vehicles[i] = Object.assign(new Vehicle(), settings.vehicles[i]);
    }
    return settings;
  }

  /**
   * Launch rush.
   */
  async launchRush(): Promise<void> {
    this._socket.emit('lobby:rush:launch');
    return this._socket.fromOneTimeEvent<void>('lobby:rush:launched');
  }

  /**
   * Leave a joined rush if exists.
   */
  leaveRush(): Promise<void> {
    this._socket.emit('lobby:rush:leave');
    return this._socket.fromOneTimeEvent<void>('lobby:rush:leaved');
  }
}
