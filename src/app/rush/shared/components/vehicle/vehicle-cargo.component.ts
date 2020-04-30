import {Component, Input} from '@angular/core';

import {AppContext} from '../../../../core';
import {Cargo, CargoOwner, Fragment, FragmentOre, Ore, SettingsUtils, Vehicle, VehicleUtils} from '../../../../shared';
import {ItemGroup} from '../common';

@Component({
  selector: 'app-vehicle-cargo',
  templateUrl: './vehicle-cargo.component.html',
  styleUrls: ['./vehicle-cargo.component.scss']
})
export class VehicleCargoComponent {
  /* FIELDS ================================================================ */
  vehicle: Vehicle;
  cargo: Cargo;
  fragment: Fragment;

  itemGroups: ItemGroup[] = [];

  private _owner: CargoOwner;

  /* CONSTRUCTOR =========================================================== */
  constructor(private _appContext: AppContext) {}

  /* METHODS =============================================================== */
  @Input()
  set owner(owner: CargoOwner) {
    this._owner = owner;
    this.vehicle = owner.vehicle;
    this.cargo = owner.cargo;
    if (!this.cargo) {
      this._initCargo();
    }
    this.fragment = this.cargo.fragment;
    if (!this.fragment) {
      this._initFragment();
    }
    this._initItemGroups();
  }

  /* Events ---------------------------------------------------------------- */
  doAddFragmentOre(ore: Ore): void {
    const fragmentOre = VehicleUtils.createFragmentOre(ore);
    this.fragment.ores.push(fragmentOre);
    // TODO socket emit
  }

  doUpdateFragment() {
    VehicleUtils.updateFragment(this.fragment, true);
    VehicleUtils.updateCargo(this.cargo, true);
    // TODO socket emit
  }

  doUpdateFragmentOre(fragmentOre: FragmentOre) {
    VehicleUtils.updateFragmentOre(fragmentOre, this.fragment);
    VehicleUtils.updateFragment(this.fragment);
    VehicleUtils.updateCargo(this.cargo, true);
    // TODO socket emit
  }

  doValidateFragment(): void {
    this.cargo.fragments.push(this.cargo.fragment);
    VehicleUtils.updateCargo(this.cargo, false);

    this._initFragment();
    this._initItemGroups();
    // TODO socket emit
  }

  /* Tools ----------------------------------------------------------------- */
  private _initCargo(): void {
    this.cargo = VehicleUtils.createCargo(this._owner);
    this._owner.cargo = this.cargo;
  }

  private _initFragment(): void {
    this.fragment = VehicleUtils.createFragment(this.cargo, this._appContext.rush.settings);
    this.cargo.fragment = this.fragment;
  }

  private _initItemGroups(): void {
    let ores = SettingsUtils.findAllOres(this._appContext.rush.settings, 'vehicle', false);
    if (this.fragment.ores.length > 0) {
      const oreNames = this.fragment.ores.map(fragmentOre => fragmentOre.ore.name);
      ores = ores.filter(ore => oreNames.includes(ore.name));
    }

    this.itemGroups = [];
    if (ores.length > 0) {
      this.itemGroups.push({type: 'ore', items: ores});
    }
  }
}
