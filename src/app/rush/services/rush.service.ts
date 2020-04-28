import {Injectable} from '@angular/core';

import {Box, BoxItem, Player} from '../../shared';

@Injectable()
export class RushService {
  /* METHODS =============================================================== */
  estimatePlayerValue(player: Player) {
    let value = 0;
    if (player.rucksack) {
      value += this.estimateBoxValue(player.rucksack);
    }
    player.boxes.forEach(box => value += this.estimateBoxValue(box));
    return value;
  }

  estimateBoxValue(box: Box): number {
    let value = 0;
    box.items.forEach(boxItem => value += this.estimateBoxItemValue(boxItem));
    return value;
  }

  estimateBoxItemValue(boxItem: BoxItem): number {
    return boxItem.quantity * boxItem.item.price;
  }
}
