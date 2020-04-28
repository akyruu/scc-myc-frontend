import {Component, OnInit} from '@angular/core';

import {AppContext} from '../../../core';
import {Box, BoxItem, Harvest, Ore, Player, Settings, SettingsUtils} from '../../../shared';
import {RushCalculator} from '../../services';
import {SelectItemEvent} from '../common';

@Component({
  selector: 'app-player-rucksack',
  templateUrl: './player-rucksack.component.html',
  styleUrls: ['./player-rucksack.component.scss']
})
export class PlayerRucksackComponent implements OnInit {
  /* FIELDS ================================================================ */
  player: Player;
  itemGroups: {
    type: 'harvest' | 'ore',
    items: (Harvest | Ore)[]
  }[] = [];

  private _settings: Settings;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _appContext: AppContext,
    private _rushCalculator: RushCalculator,
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.player = this._appContext.player;
    this._settings = this._appContext.rush.settings;
    this._initItems();
  }

  /* View ------------------------------------------------------------------ */
  get estimatedBoxValue(): number {
    return this.player.rucksack ? this._rushCalculator.estimateBoxValue(this.player.rucksack) : 0;
  }

  estimateBoxItemValue(boxItem: BoxItem): number {
    return this._rushCalculator.estimateBoxItemValue(boxItem);
  }

  get filledQuantity(): number {
    let filled = 0;
    if (this.player.rucksack) {
      this.player.rucksack.items.forEach(boxItem => filled += (boxItem.quantity || 0));
    }
    return filled;
  }

  get totalQuantity(): number {
    return this._settings.unit.storage.SCU;
  }

  /* Events ---------------------------------------------------------------- */
  doAddItem(event: SelectItemEvent): void {
    if (!this.player.rucksack) {
      const box = new Box();
      box.index = this.player.boxes.length + 1;
      this.player.rucksack = box;
    }

    const boxItem = new BoxItem();
    boxItem.type = event.type;
    boxItem.item = event.item;
    this.player.rucksack.items.push(boxItem);
  }

  doMoveToBox(): void {
    this.player.boxes.push(this.player.rucksack);
    this.player.rucksack = undefined;
    this._initItems();
  }

  /* Tools ----------------------------------------------------------------- */
  private _initItems(): void {
    let harvests = this._settings.harvests;
    let ores = SettingsUtils.findAllOres(this._settings, 'player');

    if (this.player.rucksack) {
      const itemNames = this.player.rucksack.items.map(boxItem => boxItem.item.name);
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
}
