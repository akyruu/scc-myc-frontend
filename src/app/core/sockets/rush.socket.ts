import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {map} from 'rxjs/operators';

import {BindUtils, Player, SocketContext} from '../../shared';
import {SocketService} from './socket.service';

@Injectable({providedIn: 'root'})
export class RushSocket {
  /* FIELDS ================================================================ */
  readonly playerJoined = this._socket.fromEvent<Player>('lobby:rush:playerJoined')
    .pipe(map(player => Object.assign(new Player(), player)));
  readonly playerLeaved = this._socket.fromEvent<string>('lobby:rush:playerLeaved');

  readonly rushLaunched = this._socket.fromEvent<void>('lobby:rush:launched');

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _socket: Socket,
    private _socketService: SocketService
  ) {}

  /* METHODS =============================================================== */
  /**
   * Create a new rush and join it.
   * The player is the leader of this rush.
   *
   * @param playerName Player name assigned to leader.
   */
  async createRush(playerName: string): Promise<SocketContext> {
    const result = await this._socketService.emit<SocketContext>('lobby:rush:create', playerName);
    result.player = BindUtils.bindPlayer(result.player);
    result.rush = BindUtils.bindRush(result.rush, result.player);
    return result;
  }

  /**
   * Join an existing rush. The player must be unique.
   *
   * @param playerName Player's name.
   * @param rushUuid Identifier of rush to join.
   */
  async joinRush(playerName: string, rushUuid: string): Promise<SocketContext> {
    const result = await this._socketService.emit<SocketContext>('lobby:rush:join', {playerName: playerName, rushUuid: rushUuid});
    result.player = BindUtils.bindPlayer(result.player);
    result.rush = BindUtils.bindRush(result.rush, result.player);
    return result;
  }

  /**
   * Launch rush.
   */
  async launchRush(): Promise<void> {
    return this._socketService.emit('lobby:rush:launch');
  }

  /**
   * Leave a joined rush if exists.
   */
  leaveRush(): Promise<void> {
    return this._socketService.emit('lobby:rush:leave');
  }
}
