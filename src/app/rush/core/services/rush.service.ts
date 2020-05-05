import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {AppContext, PlayerSocket} from '../../../core';
import {PlayerUtils, Rush, RushUtils} from '../../../shared';

@Injectable()
export class RushService {
  /* FIELDS ================================================================ */
  private readonly _subscriptions = {
    player: <Subscription[]>[]
  };

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _router: Router,
    private _appContext: AppContext,
    private _playerSocket: PlayerSocket,
  ) {}

  /* METHODS =============================================================== */
  get rush(): Rush {
    return this._appContext.rush;
  }

  bindPlayerEvents(): void {
    this.unbindPlayerEvents();
    this._subscriptions.player = [
      this._playerSocket.rucksackBoxItemAdded.subscribe(data => {
        const player = RushUtils.findPlayerDeep(this.rush, data.playerName);
        PlayerUtils.rucksackAddBoxItem(player, data.boxItem);
      }),
      this._playerSocket.rucksackBoxItemUpdated.subscribe(data => {
        const player = RushUtils.findPlayerDeep(this.rush, data.playerName);
        const boxItem = PlayerUtils.findBoxItem(player.rucksack, data.itemName);

        const updatedProps = data.updatedProps;
        if (updatedProps.quantity !== undefined) {
          boxItem.quantity = updatedProps.quantity;
          PlayerUtils.updateBoxItem(boxItem);
          PlayerUtils.updateBox(player.rucksack);
        }
      }),
      this._playerSocket.rucksackMovedToBox.subscribe(data => {
        const player = RushUtils.findPlayerDeep(this.rush, data.playerName);
        player.boxes.push(player.rucksack);
        player.rucksack = undefined;
      })
    ]
    ;
  }

  unbindPlayerEvents(): void {
    this._subscriptions.player.forEach(subscription => subscription.unsubscribe());
  }
}
