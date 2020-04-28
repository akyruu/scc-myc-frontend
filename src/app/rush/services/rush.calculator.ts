import {Injectable} from '@angular/core';

import {AppContext} from '../../core';
import {Box, BoxItem, Cargo, Fragment, FragmentOre, Ore, Player, Settings, SettingsUtils} from '../../shared';

@Injectable()
export class RushCalculator {
  /* FIELDS ================================================================ */
  private readonly _settings: Settings;
  private readonly _inertMaterialOre: Ore;

  /* CONSTRUCTOR =========================================================== */
  constructor(appContext: AppContext) {
    this._settings = appContext.rush.settings;
    this._inertMaterialOre = SettingsUtils.findInertMaterialOre(this._settings);
  }

  /* METHODS =============================================================== */
  estimatePlayerValue(player: Player) {
    let value = 0;
    if (player.rucksack) {
      value += this.estimateBoxValue(player.rucksack);
    }
    player.boxes.forEach(box => value += this.estimateBoxValue(box));
    return value;
  }

  /* Rucksack -------------------------------------------------------------- */
  estimateBoxValue(box: Box): number {
    let value = 0;
    box.items.forEach(boxItem => value += this.estimateBoxItemValue(boxItem));
    return value;
  }

  estimateBoxItemValue(boxItem: BoxItem): number {
    return (boxItem.quantity || 0) * boxItem.item.price;
  }

  /* Vehicle --------------------------------------------------------------- */
  calculateCargoQuantity(cargo: Cargo, includeCurrent = false): number {
    let value = 0;
    cargo.fragments.forEach(fragment => value += this.calculateFragmentQuantity(fragment));

    if (includeCurrent && cargo.fragment) {
      value += this.calculateFragmentQuantity(cargo.fragment);
    }
    return value;
  }

  estimateCargoValue(cargo: Cargo, includeCurrent = false): number {
    let value = 0;
    cargo.fragments.forEach(fragment => value += this.estimateFragmentValue(fragment));

    if (includeCurrent && cargo.fragment) {
      value += this.estimateFragmentValue(cargo.fragment);
    }
    return value;
  }

  /* Fragment */
  calculateFragmentQuantity(fragment: Fragment): number {
    let value = 0;
    fragment.ores.forEach(fragmentOre => value += this.calculateFragmentOreQuantity(fragmentOre, fragment.mass));

    const inertMaterialPercent = this.calculateFragmentInertMaterialPercent(fragment);
    if (inertMaterialPercent > 0) {
      value += this._calculateFragmentOreQuantity(inertMaterialPercent, this._inertMaterialOre, fragment.mass);
    }
    return value;
  }

  estimateFragmentValue(fragment: Fragment): number {
    let value = 0;
    fragment.ores.forEach(fragmentOre => value += this.estimateFragmentOreValue(fragmentOre, fragment.mass));

    const inertMaterialPercent = this.calculateFragmentInertMaterialPercent(fragment);
    if (inertMaterialPercent > 0) {
      value += this._estimateFragmentOreValue(inertMaterialPercent, this._inertMaterialOre, fragment.mass);
    }
    return value;
  }

  /* Fragment Ore */
  calculateFragmentInertMaterialPercent(fragment: Fragment): number {
    let value = 100;
    fragment.ores.forEach(fragmentOre => value -= (fragmentOre.percent || 0));
    return Math.max(value, 0);
  }

  calculateFragmentOreQuantity(fragmentOre: FragmentOre, mass: number): number {
    return this._calculateFragmentOreQuantity(fragmentOre.percent, fragmentOre.ore, mass);
  }

  private _calculateFragmentOreQuantity(percent: number, ore: Ore, mass: number): number {
    return ((mass || 0) / 100) * (percent || 0) / ore.density;
  }

  estimateFragmentOreValue(fragmentOre: FragmentOre, mass: number): number {
    return this._estimateFragmentOreValue(fragmentOre.percent, fragmentOre.ore, mass);
  }

  private _estimateFragmentOreValue(percent: number, ore: Ore, mass: number) {
    return this._calculateFragmentOreQuantity(percent, ore, mass) * ore.price;
  }
}
