import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {map} from 'rxjs/operators';

import {Group, GroupProps} from '../../shared';
import {ModelBinder, SocketService} from '../services';

@Injectable({providedIn: 'root'})
export class GroupSocket {
  /* FIELDS ================================================================ */
  readonly groupCreated = this._socket.fromEvent<Group>('group:created')
    .pipe(map(group => this._modelBinder.bindGroup(group)));
  readonly groupPropsUpdated = this._socket.fromEvent<{ groupIndex: number, updatedProps: GroupProps }>('group:propsUpdated');
  readonly groupRemoved = this._socket.fromEvent<number>('group:removed');

  readonly playerAdded = this._socket.fromEvent<{ playerName: string, groupIndex: number }>('group:playerAdded');
  readonly playerRemoved = this._socket.fromEvent<{ playerName: string, groupIndex: number }>('group:playerRemoved');
  readonly playerSwitched = this._socket.fromEvent<{ playerName: string, oldGroupIndex: number, newGroupIndex: number }>('group:playerSwitched');

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _socket: Socket,
    private _modelBinder: ModelBinder,
    private _socketService: SocketService
  ) {}

  /* METHODS =============================================================== */
  /**
   * Add a new group.
   *
   * @param groupName Name of group.
   */
  createGroup(groupName?: string): Promise<void> {
    return this._socketService.emit('group:create', groupName);
  }

  /**
   * Update the properties of group.
   *
   * @param groupIndex Index of group to update.
   * @param updatedProps Updated properties of group.
   */
  updateGroupProps(groupIndex: number, updatedProps: GroupProps): Promise<void> {
    return this._socketService.emit('group:updateProps', {groupIndex: groupIndex, updatedProps: updatedProps});
  }

  /**
   * Remove existing group.
   *
   * @param groupIndex Index of group to remove.
   */
  removeGroup(groupIndex: number): Promise<void> {
    return this._socketService.emit('group:remove', groupIndex);
  }

  /* Player ---------------------------------------------------------------- */
  /**
   * Add player to group.
   *
   * @param playerName Player to add.
   * @param groupIndex Index of target group.
   */
  addPlayer(playerName: string, groupIndex: number): Promise<void> {
    return this._socketService.emit('group:addPlayer', {playerName: playerName, groupIndex: groupIndex});
  }

  /**
   * Remove player in group.
   *
   * @param playerName Player name to remove.
   * @param groupIndex Index of target group.
   */
  removePlayer(playerName: string, groupIndex: number): Promise<void> {
    return this._socketService.emit('group:removePlayer', {playerName: playerName, groupIndex: groupIndex});
  }

  /**
   * Switch player between two groups.
   *
   * @param playerName Player name to switch.
   * @param oldGroupIndex Index of source group.
   * @param newGroupIndex Index of target group.
   */
  switchPlayer(playerName: string, oldGroupIndex: number, newGroupIndex: number): Promise<void> {
    return this._socketService.emit('group:switchPlayer', {
      playerName: playerName,
      oldGroupIndex: oldGroupIndex,
      newGroupIndex: newGroupIndex
    });
  }
}
