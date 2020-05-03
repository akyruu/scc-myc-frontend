import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

import {PlayerProps} from '../../shared';
import {SocketService} from './socket.service';

@Injectable({providedIn: 'root'})
export class PlayerSocket {
  /* FIELDS ================================================================ */
  readonly playerUpdated = this._socket.fromEvent<{ playerName: string, updatedProps: PlayerProps }>('lobby:player:propsUpdated');

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _socket: Socket,
    private _socketService: SocketService,
  ) {}

  /* METHODS =============================================================== */
  /**
   * Update the properties of player.
   *
   * @param playerName Name of player to update.
   * @param updatedProps Updated properties of player.
   */
  updatePlayerProps(playerName: string, updatedProps: PlayerProps): Promise<void> {
    return this._socketService.emit('lobby:player:updateProps', {playerName: playerName, updatedProps: updatedProps});
  }
}
