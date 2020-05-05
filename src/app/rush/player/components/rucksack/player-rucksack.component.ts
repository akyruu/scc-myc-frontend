import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

import {AppContext, PlayerSocket} from '../../../../core';
import {Box, BoxItem, Group, Harvest, Ore, Player, PlayerUtils, Rush, Settings, SettingsUtils} from '../../../../shared';
import {RushService} from '../../../core';
import {SelectItemEvent} from '../../../shared/components/common';

@Component({
  selector: 'app-player-rucksack',
  templateUrl: './player-rucksack.component.html',
  styleUrls: ['./player-rucksack.component.scss']
})
export class PlayerRucksackComponent implements OnInit, OnDestroy {
  /* FIELDS ================================================================ */
  rucksack: Box;
  boxes: Box[] = [];
  estimatedTotal: number;

  itemGroups: {
    type: 'harvest' | 'ore',
    items: (Harvest | Ore)[]
  }[] = [];

  private _player: Player;
  private _rush: Rush;
  private _settings: Settings;
  private readonly _subscriptions: Subscription[] = [];

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _route: ActivatedRoute,
    private _appContext: AppContext,
    private _playerSocket: PlayerSocket,
    private _rushService: RushService
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this._rush = this._appContext.rush;
    this._settings = this._rush.settings;

    this._subscriptions.push(this._route.data.subscribe((data: { player: Player, group: Group }) => {
      this._player = data.player;
      this.rucksack = this._player.rucksack;
      if (!this.rucksack) {
        this._initRucksack();
      }
      this._initItemGroups();

      this.boxes = this._player.boxes;
      this._estimateTotal();
    }));
    this._subscriptions.push(
      this._playerSocket.rucksackBoxItemUpdated.subscribe(data => {
        if (data.playerName === this._player.name) {
          this._estimateTotal();
        }
      }),
      this._playerSocket.rucksackMovedToBox.subscribe(data => {
        if (data.playerName === this._player.name) {
          this._initRucksack();
          this._initItemGroups();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /* Events ---------------------------------------------------------------- */
  doAddBoxItem(event: SelectItemEvent): void {
    if (this._rush.single) {
      const boxItem = PlayerUtils.createBoxItem(event.type, event.item);
      this.rucksack.items.push(boxItem);
    } else {
      this._playerSocket.rucksackAddBoxItem(this._player.name, event.type, event.item.name).then();
    }
  }

  doUpdateBoxItemQuantity(boxItem: BoxItem) {
    if (this._rush.single) {
      PlayerUtils.updateBoxItem(boxItem);
      PlayerUtils.updateBox(this.rucksack);
      this._estimateTotal();
    } else {
      this._playerSocket.rucksackUpdateBoxItemProps(this._player.name, boxItem.item.name, {quantity: boxItem.quantity}).then();
    }
  }

  doMoveToBox(): void {
    if (this._rush.single) {
      this._player.boxes.push(this.rucksack);
      this._initRucksack();
      this._initItemGroups();
    } else {
      this._playerSocket.rucksackMoveToBox(this._player.name).then();
    }
  }

  /* Tools ----------------------------------------------------------------- */
  private _initItemGroups(): void {
    let harvests = this._settings.harvests;
    let ores = SettingsUtils.findAllOres(this._settings, 'player');

    if (this.rucksack.items.length > 0) {
      const itemNames = this.rucksack.items.map(boxItem => boxItem.item.name);
      harvests = harvests.filter(harvest => itemNames.includes(harvest.name));
      ores = ores.filter(ore => itemNames.includes(ore.name));
    }

    this.itemGroups = [];
    if (harvests.length > 0) {
      this.itemGroups.push({type: 'harvest', items: harvests});
    }
    if (ores.length > 0) {
      this.itemGroups.push({type: 'ore', items: ores});
    }
  }

  private _initRucksack(): void {
    this.rucksack = PlayerUtils.createBox(this._player, this._settings);
    this._player.rucksack = this.rucksack;
  }

  private _estimateTotal() {
    let total = 0;
    this._player.boxes.forEach(box => total += box.calculated.value);
    total += this.rucksack.calculated.value;
    this.estimatedTotal = total;
  }
}
