import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {map} from 'rxjs/operators';

import {Group, GroupProps} from '../../shared';

@Injectable({providedIn: 'root'})
export class LobbyGroupSocket {
  /* FIELDS ================================================================ */
  readonly groupCreated = this._socket.fromEvent<Group>('lobby:group:created')
    .pipe(map(group => Object.assign(new Group(), group)));
  readonly groupPropsUpdated = this._socket.fromEvent<{ groupIndex: number, updatedProps: GroupProps }>('lobby:group:propsUpdated');
  readonly groupRemoved = this._socket.fromEvent<number>('lobby:group:removed');

  readonly playerAdded = this._socket.fromEvent<{ playerName: string, groupIndex: number }>('lobby:group:playerAdded');
  readonly playerRemoved = this._socket.fromEvent<{ playerName: string, groupIndex: number }>('lobby:group:playerRemoved');
  readonly playerSwitched = this._socket.fromEvent<{ playerName: string, oldGroupIndex: number, newGroupIndex: number }>('lobby:group:playerSwitched');

  /* CONSTRUCTOR =========================================================== */
  constructor(private _socket: Socket) {}

  /* METHODS =============================================================== */
  /**
   * Add a new group.
   *
   * @param groupName Name of group.
   */
  createGroup(groupName?: string): void {
    this._socket.emit('lobby:group:create', groupName);
  }

  /**
   * Update the properties of group.
   *
   * @param groupIndex Index of group to update.
   * @param updatedProps Updated properties of group.
   */
  updateGroupProps(groupIndex: number, updatedProps: GroupProps): Promise<void> {
    this._socket.emit('lobby:group:updateProps', {groupIndex: groupIndex, updatedProps: updatedProps});
    return this._socket.fromOneTimeEvent('lobby:group:propsUpdated');
  }

  /**
   * Remove existing group.
   *
   * @param groupIndex Index of group to remove.
   */
  removeGroup(groupIndex: number): void {
    this._socket.emit('lobby:group:remove', groupIndex);
  }

  /* Player ---------------------------------------------------------------- */
  /**
   * Add player to group.
   *
   * @param playerName Player to add.
   * @param groupIndex Index of target group.
   */
  addPlayer(playerName: string, groupIndex: number): void {
    this._socket.emit('lobby:group:addPlayer', {playerName: playerName, groupIndex: groupIndex});
  }

  /**
   * Remove player in group.
   *
   * @param playerName Player name to remove.
   * @param groupIndex Index of target group.
   */
  removePlayer(playerName: string, groupIndex: number): void {
    this._socket.emit('lobby:group:removePlayer', {playerName: playerName, groupIndex: groupIndex});
  }

  /**
   * Switch player between two groups.
   *
   * @param playerName Player name to switch.
   * @param oldGroupIndex Index of source group.
   * @param newGroupIndex Index of target group.
   */
  switchPlayer(playerName: string, oldGroupIndex: number, newGroupIndex: number): void {
    this._socket.emit('lobby:group:switchPlayer', {playerName: playerName, oldGroupIndex: oldGroupIndex, newGroupIndex: newGroupIndex});
  }
}
