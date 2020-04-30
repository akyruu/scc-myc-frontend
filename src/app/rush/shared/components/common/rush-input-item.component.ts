import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-rush-input-item',
  templateUrl: './rush-input-item.component.html'
})
export class RushInputItemComponent {
  @Input() item: { name: string, price: number };
  @Input() type: string;
  @Input() estimatedValue: number;
  @Input() disabled: boolean;

  @Input() quantity: number;
  @Output() quantityChange = new EventEmitter<number>();
  @Input() percent: boolean;
}
