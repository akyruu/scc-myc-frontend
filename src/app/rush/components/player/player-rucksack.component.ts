import {Component, OnInit} from '@angular/core';

import {AppContext} from '../../../core';
import {Box, BoxItem, Harvest, Ore, Player, Settings, SettingsUtils} from '../../../shared';
import {RushService} from '../../services';

@Component({
  selector: 'app-player-rucksack',
  templateUrl: './player-rucksack.component.html'
})
export class PlayerRucksackComponent implements OnInit {
  /* FIELDS ================================================================ */
  player: Player;

  settings: Settings;
  harvests: Harvest[];
  ores: Ore[] = [];

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _appContext: AppContext,
    private _rushService: RushService,
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.player = this._appContext.player;

    this.settings = this._appContext.rush.settings;
    this.harvests = this.settings.harvests;
    this.ores = SettingsUtils.findAllOres(this.settings, 'player');
  }

  /* View ------------------------------------------------------------------ */
  countItems(type?: 'ore' | 'harvest'): number {
    let count = 0;
    if (this.player.rucksack) {
      let items = this.player.rucksack.items;
      if (type) {
        items = items.filter(item => item.type === type);
      }
      items.forEach(item => count += item.quantity);
    }
    return count;
  }

  get estimatedTotal(): number {
    const rucksack = this.player.rucksack;
    return rucksack ? this._rushService.estimateBoxValue(this.player.rucksack) : 0;
  }

  getEstimatedValue(boxItem: BoxItem): number {
    return this._rushService.estimateBoxItemValue(boxItem);
  }

  hasItems(): boolean {
    return this.harvests.length > 0 || this.ores.length > 0;
  }

  get percentRucksackFilled(): number {
    let rucksackFilled = 0.0;
    if (this.player.rucksack) {
      this.player.rucksack.items.forEach(boxItem => rucksackFilled += boxItem.quantity);
    }
    return rucksackFilled / this.settings.unit.storage.SCU;
  }

  /* Events ---------------------------------------------------------------- */
  doAddItem(data: { item: Harvest | Ore, type: 'harvest' | 'ore' }): void {
    if (!this.player.rucksack) {
      const box = new Box();
      box.index = this.player.boxes.length + 1;
      this.player.rucksack = box;
    }

    const boxItem = new BoxItem();
    boxItem.item = data.item;
    boxItem.type = data.type;
    this.player.rucksack.items.push(boxItem);

    // Filter lists
    this.harvests = this.harvests.filter(harvest => harvest.name !== data.item.name);
    this.ores = this.ores.filter(ore => ore.name !== data.item.name);
  }

  doMoveToBox(): void {
    this.player.boxes.push(this.player.rucksack);
    this.player.rucksack = undefined;
  }
}
