import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {map} from 'rxjs/operators';

import {BoxItem, BoxItemProps, ItemType, PlayerProps} from '../../shared';
import {ModelBinder, SocketService} from '../services';

@Injectable({providedIn: 'root'})
export class PlayerSocket {
  /* FIELDS ================================================================ */
  readonly playerUpdated = this._socket.fromEvent<{ playerName: string, updatedProps: PlayerProps }>('player:propsUpdated');

  /* Rucksack -------------------------------------------------------------- */
  readonly rucksackBoxItemAdded = this._socket.fromEvent<{ playerName: string, boxItem: BoxItem }>('player:rucksack:boxItemAdded')
    .pipe(map(data => Object.assign(data, {boxItem: this._modelBinder.bindBoxItem(data.boxItem)})));
  readonly rucksackBoxItemUpdated = this._socket.fromEvent<{ playerName: string, itemName: string, updatedProps: BoxItemProps }>('player:rucksack:boxItemPropsUpdated');
  readonly rucksackMovedToBox = this._socket.fromEvent<{ playerName: string }>('player:rucksack:movedToBox');

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _socket: Socket,
    private _modelBinder: ModelBinder,
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
    return this._socketService.emit('player:updateProps', {playerName: playerName, updatedProps: updatedProps});
  }

  /* Rucksack -------------------------------------------------------------- */
  /**
   * Add box item in rucksack of player.
   *
   * @param playerName Name of rucksack owner.
   * @param itemType Type of item
   * @param itemName Name of item.
   */
  rucksackAddBoxItem(playerName: string, itemType: ItemType, itemName: string): Promise<void> {
    return this._socketService.emit('player:rucksack:addBoxItem', {playerName: playerName, itemType: itemType, itemName: itemName});
  }

  /**
   * Update box item properties in rucksack of player.
   *
   * @param playerName Name of rucksack owner.
   * @param itemName Name of item (unique in box)
   * @param updatedProps Properties to update.
   */
  rucksackUpdateBoxItemProps(playerName: string, itemName: string, updatedProps: BoxItemProps): Promise<void> {
    return this._socketService.emit('player:rucksack:updateBoxItemProps', {
      playerName: playerName,
      itemName: itemName,
      updatedProps: updatedProps
    });
  }

  /**
   * Move rucksack content to a box.
   *
   * @param playerName Name of rucksack owner.
   */
  rucksackMoveToBox(playerName: string) {
    return this._socketService.emit('player:rucksack:moveToBox', playerName);
  }
}
