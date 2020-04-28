import {Component, OnInit} from '@angular/core';

import {AppContext} from '../../../core';
import {Cargo, Fragment, FragmentOre, Ore, Player, Settings, SettingsUtils} from '../../../shared';
import {RushCalculator} from '../../services';
import {ItemGroup} from '../common';

@Component({
  selector: 'app-player-vehicle',
  templateUrl: './player-vehicle.component.html',
  styleUrls: ['./player-vehicle.component.scss']
})
export class PlayerVehicleComponent implements OnInit {
  /* FIELDS ================================================================ */
  player: Player;
  itemGroups: ItemGroup[] = [];

  private _settings: Settings;
  private _inertMaterialOre: Ore;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _appContext: AppContext,
    private _rushCalculator: RushCalculator,
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this.player = this._appContext.player;

    this._settings = this._appContext.rush.settings;
    this._inertMaterialOre = SettingsUtils.findInertMaterialOre(this._settings);
    this._initItems();
  }

  /* View ------------------------------------------------------------------ */
  get fragmentIndex(): number {
    return (this.player.cargo?.fragments?.length || 0) + 1;
  }

  get fragmentMass(): number {
    return this.player.cargo?.fragment?.mass;
  }

  set fragmentMass(mass: number) {
    const fragment = this._getOrCreateFragment();
    fragment.mass = mass;
  }

  get estimatedCargoValue(): number {
    const cargo = this.player.cargo;
    return cargo ? this._rushCalculator.estimateCargoValue(cargo, true) : 0;
  }

  get estimatedFragmentValue(): number {
    const fragment = this.player.cargo?.fragment;
    return fragment ? this._rushCalculator.estimateFragmentValue(fragment) : 0;
  }

  estimateFragmentOreValue(fragmentOre: FragmentOre): number {
    return this._rushCalculator.estimateFragmentOreValue(fragmentOre, this.fragmentMass);
  }

  get filledQuantity(): number {
    let cargoFilled = 0;
    if (this.player.cargo) {
      cargoFilled = this._rushCalculator.calculateCargoQuantity(this.player.cargo, true);
    }
    return cargoFilled;
  }

  get totalQuantity(): number {
    return this.player.vehicle.cargo;
  }

  /* Events ---------------------------------------------------------------- */
  doAddFragmentOre(ore: Ore): void {
    const fragment = this._getOrCreateFragment();

    const fragmentOre = new FragmentOre();
    fragmentOre.ore = ore;
    fragment.ores.push(fragmentOre);
  }

  doSalesCargo(): void {
    // TODO open a dialog for enter amount of sales
    this.player.cargos.push(this.player.cargo);
    this.player.cargo = undefined;
  }

  doValidateFragment(): void {
    let cargo = this.player.cargo;
    cargo.fragments.push(cargo.fragment);
    cargo.fragment = null;
    this._initItems();
  }

  /* Tools ----------------------------------------------------------------- */
  private _getOrCreateFragment(): Fragment {
    let cargo = this.player.cargo;
    if (!cargo) {
      cargo = new Cargo();
      cargo.index = this.player.cargos.length + 1;
      cargo.vehicle = this.player.vehicle;
      this.player.cargo = cargo;
    }

    let fragment = cargo.fragment;
    if (!fragment) {
      fragment = new Fragment();
      fragment.index = cargo.fragments.length + 1;
      cargo.fragment = fragment;
    }
    return fragment;
  }

  private _initItems(): void {
    let ores = SettingsUtils.findAllOres(this._settings, 'vehicle');

    if (this.player.cargo?.fragment) {
      const oreNames = this.player.cargo.fragment.ores.map(fragmentOre => fragmentOre.ore.name);
      ores = ores.filter(ore => oreNames.includes(ore.name));
    }
    ores = ores.filter(ore => ore.name !== this._inertMaterialOre.name);

    this.itemGroups = [];
    if (ores.length > 0) {
      this.itemGroups.push({type: 'ore', items: ores});
    }
  }
}
