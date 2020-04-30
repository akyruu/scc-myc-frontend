import {Component, Input} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute} from '@angular/router';

import {AppContext} from '../../../../core';
import {Box, BoxItem, Harvest, Ore, SettingsUtils} from '../../../../shared';

class Data {
  quantity = 0;
  estimatedValue = 0;

  constructor(private item: Harvest | Ore) {}
}

@Component({
  selector: 'app-boxes-overview',
  templateUrl: './boxes-overview.component.html',
  styleUrls: ['./boxes-overview.component.scss']
})
export class BoxesOverviewComponent {
  /* FIELDS ================================================================ */
  readonly columns = ['unitPrice', 'name', 'quantity', 'estimatedValue'];
  readonly dataSource = new MatTableDataSource<Data>();
  total: Data;

  private _boxes: Box[];

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _route: ActivatedRoute,
    private _appContext: AppContext
  ) {}

  /* METHODS =============================================================== */
  @Input()
  set boxes(boxes: Box[]) {
    this._boxes = boxes;
    this._initData();
  }

  private _initData(): void {
    let data: Data[] = [];
    const total = new Data(null);

    // Collect all data
    const dataByItemName = new Map<string, Data>();
    SettingsUtils.findAllOres(this._appContext.rush.settings, 'player')
      .forEach(ore => dataByItemName.set(ore.name, new Data(ore)));
    this._appContext.rush.settings.harvests.forEach(harvest => dataByItemName.set(harvest.name, new Data(harvest)));

    this._boxes.forEach(box => {
      box.items.forEach(boxItem => {
        const data = dataByItemName.get(boxItem.item.name);
        this._updateData(data, boxItem);
        this._updateData(total, boxItem);
      });
    });

    // Remove not collected data
    data = Array.from(dataByItemName.values())
      .filter(data => data.quantity > 0);

    this.dataSource.data = data;
    this.total = total;
  }

  private _updateData(data: Data, boxItem: BoxItem): void {
    data.quantity += boxItem.quantity;
    data.estimatedValue += boxItem.calculated.value;
  }
}
