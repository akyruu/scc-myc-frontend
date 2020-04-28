import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-resume-item',
  templateUrl: './resume-item.component.html',
  styleUrls: ['./resume-item.component.scss']
})
export class ResumeItemComponent {
  @Input() icon: string;
  @Input() svgIcon: string;

  @Input() label: string;
  @Input() transLabel: string;

  @Input() value: number;
  @Input() total: number;
  @Input() currency: boolean;

  @HostBinding('attr.class') className = 'resume-item';
}
