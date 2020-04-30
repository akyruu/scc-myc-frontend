import {Component, Input} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute} from '@angular/router';

import {AppContext} from '../../../../core';
import {Cargo, CargoOwner, FragmentOre, Ore, SettingsUtils, Vehicle} from '../../../../shared';

class Data {
  mass = 0;
  quantity = 0;
  cargoPercent = 0;
  estimatedValue = 0;

  constructor(private ore: Ore) {}
}

@Component({
  selector: 'app-vehicle-cargo-overview',
  templateUrl: './vehicle-cargo-overview.component.html',
  styleUrls: ['./vehicle-cargo-overview.component.scss']
})
export class VehicleCargoOverviewComponent {
  /* FIELDS ================================================================ */
  vehicle: Vehicle;

  readonly columns = ['unitPrice', 'name', 'mass', 'quantity', 'cargoPercent', 'estimatedValue'];
  readonly dataSource = new MatTableDataSource<Data>();
  total: Data;

  private _owner: CargoOwner;
  private _cargo: Cargo;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _route: ActivatedRoute,
    private _appContext: AppContext
  ) {}

  /* METHODS =============================================================== */
  @Input() set owner(owner: CargoOwner) {
    this._owner = owner;
    this.vehicle = owner.vehicle;
    this._cargo = owner.cargo;
    this._initData();
  }

  private _initData(): void {
    let data: Data[] = [];
    const total = new Data(null);

    if (this._cargo) {
      // Collect all data
      const dataByOreName = new Map<string, Data>();
      SettingsUtils.findAllOres(this._appContext.rush.settings, 'vehicle')
        .forEach(ore => dataByOreName.set(ore.name, new Data(ore)));

      const inertOre = SettingsUtils.findInertOre(this._appContext.rush.settings);
      const inertData = dataByOreName.get(inertOre.name);
      this._cargo.fragments.forEach(fragment => {
        fragment.ores.forEach(fragmentOre => {
          const data = dataByOreName.get(fragmentOre.ore.name);
          this._updateData(data, fragmentOre);
        });
        this._updateData(inertData, fragment.inertOre);
      });
      dataByOreName.forEach(data => data.cargoPercent = data.quantity / this._cargo.vehicle.cargo);

      // Remove not collected data
      data = Array.from(dataByOreName.values())
        .filter(data => data.quantity > 0);

      // Update total
      total.mass = this._cargo.calculated.mass;
      total.quantity = this._cargo.calculated.quantity;
      total.cargoPercent = this._cargo.calculated.percent;
      total.estimatedValue = this._cargo.calculated.value;
    }

    this.dataSource.data = data;
    this.total = total;
  }

  private _updateData(data: Data, fragmentOre: FragmentOre): void {
    data.mass += fragmentOre.calculated.mass;
    data.quantity += fragmentOre.calculated.quantity;
    data.estimatedValue += fragmentOre.calculated.value;
  }
}
