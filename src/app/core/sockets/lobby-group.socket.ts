import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

import {Group, GroupProps} from '../../shared';

@Injectable({providedIn: 'root'})
export class LobbyGroupSocket {
  /* FIELDS ================================================================ */
  readonly groupCreated = this._socket.fromEvent<Group>('lobby:group:created');
  readonly groupPropsUpdated = this._socket.fromEvent<{ groupName: string, updatedProps: GroupProps }>('lobby:group:propsUpdated');
  readonly groupRemoved = this._socket.fromEvent<string>('lobby:group:removed');

  readonly playerAdded = this._socket.fromEvent<{ playerName: string, groupName: string }>('lobby:group:playerAdded');
  readonly playerRemoved = this._socket.fromEvent<{ playerName: string, groupName: string }>('lobby:group:playerRemoved');
  readonly playerSwitched = this._socket.fromEvent<{ playerName: string, oldGroupName: string, newGroupName: string }>('lobby:group:playerSwitched');

  /* CONSTRUCTOR =========================================================== */
  constructor(private _socket: Socket) {}

  /* METHODS =============================================================== */
  /**
   * Add a new group.
   *
   * @param groupName Name of group.
   */
  createGroup(groupName: string): void {
    this._socket.emit('lobby:group:create', groupName);
  }

  /**
   * Update the properties of group.
   *
   * @param groupName Name of group to update.
   * @param updatedProps Updated properties of group.
   */
  updateGroupProps(groupName: string, updatedProps: GroupProps): Promise<void> {
    this._socket.emit('lobby:group:updateProps', {groupName: groupName, updatedProps: updatedProps});
    return this._socket.fromOneTimeEvent('lobby:group:propsUpdated');
  }

  /**
   * Remove existing group.
   *
   * @param groupName Name of group to remove.
   */
  removeGroup(groupName: string): void {
    this._socket.emit('lobby:group:remove', groupName);
  }

  /* Player ---------------------------------------------------------------- */
  /**
   * Add player to group.
   *
   * @param playerName Player to add.
   * @param groupName Name of target group.
   */
  addPlayer(playerName: string, groupName: string): void {
    this._socket.emit('lobby:group:addPlayer', {playerName: playerName, groupName: groupName});
  }

  /**
   * Remove player in group.
   *
   * @param playerName Player name to remove.
   * @param groupName Name of target group.
   */
  removePlayer(playerName: string, groupName: string): void {
    this._socket.emit('lobby:group:removePlayer', {playerName: playerName, groupName: groupName});
  }

  /**
   * Switch player between two groups.
   *
   * @param playerName Player name to switch.
   * @param oldGroupName Name of source group.
   * @param newGroupName Name of target group.
   */
  switchPlayer(playerName: string, oldGroupName: string, newGroupName: string): void {
    this._socket.emit('lobby:group:switchPlayer', {playerName: playerName, oldGroupName: oldGroupName, newGroupName: newGroupName});
  }
}
