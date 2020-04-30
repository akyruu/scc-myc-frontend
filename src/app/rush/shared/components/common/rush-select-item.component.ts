import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {Harvest, Ore} from '../../../../shared';

export interface SelectItemEvent {
  type: 'harvest' | 'ore';
  item: Harvest | Ore;
}

export interface ItemGroup {
  type: 'harvest' | 'ore';
  items: (Harvest | Ore)[];
}

@Component({
  selector: 'app-rush-select-item',
  templateUrl: './rush-select-item.component.html'
})
export class RushSelectItemComponent {
  /* FIELDS ================================================================ */
  @Output() selectionChange = new EventEmitter<SelectItemEvent>();

  private _itemGroups: ItemGroup[] = [];

  /* CONSTRUCTOR =========================================================== */
  constructor(private _translate: TranslateService) {}

  /* METHODS =============================================================== */
  @Input() set itemGroups(itemGroups: ItemGroup[]) {
    this._itemGroups = itemGroups || [];
    this._updateGroupsItems();
  }

  /* View ------------------------------------------------------------------ */
  get fieldLabel(): string {
    return this._itemGroups
      .map(itemGroups => itemGroups.type)
      .map(type => this._translate.instant('app.model.' + type))
      .join('/');
  }

  get hasItems(): boolean {
    return this._itemGroups.length > 0;
  }

  get itemGroups(): ItemGroup[] {
    return this._itemGroups;
  }

  /* Events ---------------------------------------------------------------- */
  onSelectItem(data: SelectItemEvent): void {
    this.selectionChange.emit(data);
    this._filterGroupsItems(data.item, data.type);
    this._updateGroupsItems();
  }

  /* Tools ----------------------------------------------------------------- */
  private _filterGroupsItems(item: Harvest | Ore, type: 'harvest' | 'ore'): void {
    const itemGroup = this._itemGroups.find(itemGroup => itemGroup.type === type);
    if (itemGroup) {
      itemGroup.items = itemGroup.items.filter(i => i.name !== item.name);
    }
  }

  private _updateGroupsItems(): void {
    const indexes = [];
    for (let i = 0; i < this._itemGroups.length; i++) {
      if (this._itemGroups[i].items.length === 0) {
        indexes.push(i);
      }
    }
    indexes.forEach(index => this._itemGroups.splice(index, 1));
  }
}
