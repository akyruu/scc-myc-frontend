import {Component, Input} from '@angular/core';

import {Label} from '../../models';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent {
  /* FIELDS ================================================================ */
  @Input() title: Label;
  @Input() subtitle: Label;
}
