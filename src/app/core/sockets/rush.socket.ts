import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {map} from 'rxjs/operators';

import {Player, SocketContext} from '../../shared';
import {ModelBinder, SocketService} from '../services';

@Injectable({providedIn: 'root'})
export class RushSocket {
  /* FIELDS ================================================================ */
  readonly playerJoined = this._socket.fromEvent<Player>('rush:playerJoined')
    .pipe(map(player => this._modelBinder.bindPlayer(player)));
  readonly playerLeaved = this._socket.fromEvent<string>('rush:playerLeaved');

  readonly rushLaunched = this._socket.fromEvent<void>('rush:launched');

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _socket: Socket,
    private _modelBinder: ModelBinder,
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
    const result = await this._socketService.emit<SocketContext>('rush:create', playerName);
    result.player = this._modelBinder.bindPlayer(result.player);
    result.rush = this._modelBinder.bindRush(result.rush, result.player);
    return result;
  }

  /**
   * Join an existing rush. The player must be unique.
   *
   * @param playerName Player's name.
   * @param rushUuid Identifier of rush to join.
   */
  async joinRush(playerName: string, rushUuid: string): Promise<SocketContext> {
    const result = await this._socketService.emit<SocketContext>('rush:join', {playerName: playerName, rushUuid: rushUuid});
    result.player = this._modelBinder.bindPlayer(result.player);
    result.rush = this._modelBinder.bindRush(result.rush, result.player);
    return result;
  }

  /**
   * Launch rush.
   */
  async launchRush(): Promise<void> {
    return this._socketService.emit('rush:launch');
  }

  /**
   * Leave a joined rush if exists.
   */
  leaveRush(): Promise<void> {
    return this._socketService.emit('rush:leave');
  }
}
