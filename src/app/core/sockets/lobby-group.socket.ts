import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

import {RoomGroup} from '../../shared';

@Injectable({providedIn: 'root'})
export class LobbyGroupSocket {
  /* FIELDS ================================================================ */
  readonly groupCreated = this._socket.fromEvent<RoomGroup>('lobby:group:created');
  readonly groupPropsUpdated = this._socket.fromEvent<{ groupName: string, updatedProps: { name?: string, vehicleName?: string } }>('lobby:group:propsUpdated');
  readonly groupRemoved = this._socket.fromEvent<string>('lobby:group:removed');

  readonly playerAdded = this._socket.fromEvent<{ player: string, groupName: string }>('lobby:group:playerAdded');
  readonly playerRemoved = this._socket.fromEvent<{ player: string, groupName: string }>('lobby:group:playerRemoved');
  readonly playerSwitched = this._socket.fromEvent<{ player: string, oldGroupName: string, newGroupName: string }>('lobby:group:playerSwitched');

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
  updateGroupProps(groupName: string, updatedProps: { name?: string, vehicleName?: string }): Promise<void> {
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
   * @param player Player to add.
   * @param groupName Name of target group.
   */
  addPlayer(player: string, groupName: string): void {
    this._socket.emit('lobby:group:addPlayer', {player: player, groupName: groupName});
  }

  /**
   * Remove player in group.
   *
   * @param player Player to remove.
   * @param groupName Name of target group.
   */
  removePlayer(player: string, groupName: string): void {
    this._socket.emit('lobby:group:removePlayer', {player: player, groupName: groupName});
  }

  /**
   * Switch player between two groups.
   *
   * @param player Player to switch.
   * @param oldGroupName Name of source group.
   * @param newGroupName Name of target group.
   */
  switchPlayer(player: string, oldGroupName: string, newGroupName: string): void {
    this._socket.emit('lobby:group:switchPlayer', {player: player, oldGroupName: oldGroupName, newGroupName: newGroupName});
  }
}
