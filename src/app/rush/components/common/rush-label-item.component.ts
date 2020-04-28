import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-rush-label-item',
  template: '{{ item.name }} ({{ \'rush.common.price.unit\' | translate }} {{ item.price | currency }})'
})
export class RushLabelItemComponent {
  @Input() item: { name: string, price: number };
}
