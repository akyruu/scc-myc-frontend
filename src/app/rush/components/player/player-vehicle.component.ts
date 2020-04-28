import {Component, OnInit} from '@angular/core';

import {AppContext} from '../../../core';
import {BoxItem, Cargo, Fragment, FragmentOre, Ore, Player, Settings, SettingsUtils} from '../../../shared';
import {RushService} from '../../services';

@Component({
  selector: 'app-player-vehicle',
  templateUrl: './player-vehicle.component.html'
})
export class PlayerVehicleComponent implements OnInit {
  /* FIELDS ================================================================ */
  player: Player;

  settings: Settings;
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
    this.ores = SettingsUtils.findAllOres(this.settings, 'vehicle');
  }

  /* View ------------------------------------------------------------------ */
  get estimatedTotal(): number {
    const rucksack = this.player.rucksack;
    return rucksack ? this._rushService.estimateBoxValue(this.player.rucksack) : 0;
  }

  getEstimatedValue(boxItem: BoxItem): number {
    return this._rushService.estimateBoxItemValue(boxItem);
  }

  hasItems(): boolean {
    return this.ores.length > 0;
  }

  get percentCargoFilled(): number {
    let cargoFilled = 0.0;
    if (this.player.cargo) {
      // TODO calculate cargo
    }
    return cargoFilled / this.player.vehicle.cargo;
  }

  /* Events ---------------------------------------------------------------- */
  doAddFragment(): void {
    if (!this.player.cargo) {
      const cargo = new Cargo();
      cargo.index = this.player.cargos.length + 1;
      cargo.vehicle = this.player.vehicle;
      this.player.cargo = cargo;
    }

    const fragment = new Fragment();
    fragment.index = this.player.cargo.fragments.length + 1;
    this.player.cargo.fragment = fragment;
  }

  doAddFragmentOre(ore: Ore): void {
    const fragmentOre = new FragmentOre();
    fragmentOre.ore = ore;
    this.player.cargo.fragment.ores.push(fragmentOre);

    // Filter lists
    this.ores = this.ores.filter(o => o.name !== ore.name);
  }

  doSalesCargo(): void {
    // TODO open a dialog for enter amount of sales
    this.player.boxes.push(this.player.rucksack);
    this.player.rucksack = undefined;
  }
}
