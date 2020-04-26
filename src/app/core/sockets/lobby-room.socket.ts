import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

import {Room} from '../../shared';

@Injectable({providedIn: 'root'})
export class LobbyRoomSocket {
  /* FIELDS ================================================================ */
  readonly playerJoined = this._socket.fromEvent<string>('lobby:room:playerJoined');
  readonly playerLeaved = this._socket.fromEvent<string>('lobby:room:playerLeaved');

  /* CONSTRUCTOR =========================================================== */
  constructor(private _socket: Socket) {}

  /* METHODS =============================================================== */
  /**
   * Create a new room and join it.
   * The player is the leader of this room.
   *
   * @param player Player's name (leader).
   */
  createRoom(player: string): Promise<Room> {
    this._socket.emit('lobby:room:create', player);
    return this._socket.fromOneTimeEvent<Room>('lobby:room:created');
  }

  /**
   * Join an existing room. The player must be unique.
   *
   * @param player Player's name.
   * @param roomUuid Identifier of room to join.
   */
  joinRoom(player: string, roomUuid: string): Promise<Room> {
    this._socket.emit('lobby:room:join', {player: player, roomUuid: roomUuid});
    return this._socket.fromOneTimeEvent<Room>('lobby:room:joined');
  }

  /**
   * Leave a joined room if exists.
   */
  leaveRoom(): Promise<void> {
    this._socket.emit('lobby:room:leave');
    return this._socket.fromOneTimeEvent<void>('lobby:room:leaved');
  }
}
