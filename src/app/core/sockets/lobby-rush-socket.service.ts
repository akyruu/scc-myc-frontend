import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

import {Player, Rush} from '../../shared';

@Injectable({providedIn: 'root'})
export class LobbyRushSocket {
  /* FIELDS ================================================================ */
  readonly playerJoined = this._socket.fromEvent<Player>('lobby:rush:playerJoined');
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
  createRush(playerName: string, single: boolean): Promise<{ player: Player, rush: Rush }> {
    this._socket.emit('lobby:rush:create', {playerName: playerName, single: single});
    return this._socket.fromOneTimeEvent<{ player: Player, rush: Rush }>('lobby:rush:created');
  }

  /**
   * Join an existing rush. The player must be unique.
   *
   * @param playerName Player's name.
   * @param rushUuid Identifier of rush to join.
   */
  joinRush(playerName: string, rushUuid: string): Promise<{ player: Player, rush: Rush }> {
    this._socket.emit('lobby:rush:join', {playerName: playerName, rushUuid: rushUuid});
    return this._socket.fromOneTimeEvent<{ player: Player, rush: Rush }>('lobby:rush:joined');
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
