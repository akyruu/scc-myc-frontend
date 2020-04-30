import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

import {AppContext} from '../../../../core';
import {Box, BoxItem, Harvest, Ore, Player, PlayerUtils, Settings, SettingsUtils} from '../../../../shared';
import {SelectItemEvent} from '../../../shared/components/common';

@Component({
  selector: 'app-player-rucksack',
  templateUrl: './player-rucksack.component.html',
  styleUrls: ['./player-rucksack.component.scss']
})
export class PlayerRucksackComponent implements OnInit {
  /* FIELDS ================================================================ */
  rucksack: Box;
  boxes: Box[] = [];
  estimatedTotal: number;

  itemGroups: {
    type: 'harvest' | 'ore',
    items: (Harvest | Ore)[]
  }[] = [];

  private _player: Player;
  private _settings: Settings;
  private _subscription: Subscription;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _route: ActivatedRoute,
    private _appContext: AppContext
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this._settings = this._appContext.rush.settings;

    this._subscription = this._route.data.subscribe((data: { player: Player }) => {
      this._player = data.player;
      this.rucksack = this._player.rucksack;
      if (!this.rucksack) {
        this._initRucksack();
      }
      this._initItemGroups();

      this.boxes = this._player.boxes;
      this._estimateTotal();
    });
  }

  /* Events ---------------------------------------------------------------- */
  doAddBoxItem(event: SelectItemEvent): void {
    const boxItem = new BoxItem();
    boxItem.type = event.type;
    boxItem.item = event.item;
    this.rucksack.items.push(boxItem);
    // TODO socket emit
  }

  doUpdateBoxItem(boxItem: BoxItem) {
    PlayerUtils.updateBoxItem(boxItem);
    PlayerUtils.updateBox(this.rucksack);
    this._estimateTotal();
    // TODO socket emit
  }

  doMoveToBox(): void {
    this._player.boxes.push(this.rucksack);
    this._estimateTotal();

    this._initRucksack();
    this._initItemGroups();
    // TODO socket emit
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
