import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

import {PlayerProps} from '../../shared';

@Injectable({providedIn: 'root'})
export class LobbyPlayerSocket {
  /* FIELDS ================================================================ */
  readonly playerUpdated = this._socket.fromEvent<{ playerName: string, updatedProps: PlayerProps }>('lobby:player:propsUpdated');

  /* CONSTRUCTOR =========================================================== */
  constructor(private _socket: Socket) {}

  /* METHODS =============================================================== */
  /**
   * Update the properties of player.
   *
   * @param playerName Name of player to update.
   * @param updatedProps Updated properties of player.
   */
  updatePlayerProps(playerName: string, updatedProps: PlayerProps): Promise<void> {
    this._socket.emit('lobby:player:updateProps', {playerName: playerName, updatedProps: updatedProps});
    return this._socket.fromOneTimeEvent('lobby:player:propsUpdated');
  }
}
