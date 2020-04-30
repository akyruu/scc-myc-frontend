import {Component, HostBinding, Input} from '@angular/core';
import {Icon, Label} from '../../models/view';

@Component({
  selector: 'app-resume-item',
  templateUrl: './resume-item.component.html',
  styleUrls: ['./resume-item.component.scss']
})
export class ResumeItemComponent {
  @Input() icon: Icon;
  @Input() label: Label;

  @Input() value: number;
  @Input() total: number;
  @Input() addedValue: number;
  @Input() tmpValue: number;
  @Input() mode: 'currency' | 'quantity';

  @HostBinding('attr.class') className = 'resume-item';
}
