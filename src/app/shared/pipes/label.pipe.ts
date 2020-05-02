import {ChangeDetectorRef, Pipe} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

import {Group, Label, Player, Vehicle} from '../models';

@Pipe({name: 'label'})
export class LabelPipe extends TranslatePipe {
  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _translate: TranslateService,
    ref: ChangeDetectorRef
  ) {
    super(_translate, ref);
  }

  /* METHODS =============================================================== */
  transform(data: Label | Group | Player | Vehicle, locale?: string): any {
    if (data) {
      if (data instanceof Group) {
        const type = data.name ? 'named' : 'default';
        return super.transform('app.label.group.' + type, data);
      } else if (data instanceof Player) {
        return super.transform('app.label.player', data);
      } else if (data instanceof Vehicle) {
        return super.transform('app.label.vehicle', data);
      } else if (data['key']) {
        return super.transform(data['key'], data['args'], locale);
      } else if (typeof data === 'string' && data.startsWith('@')) {
        return super.transform(data.substring(1));
      } else if (typeof data !== 'string') {
        console.debug('[Error] Invalid label!', data);
        return '[ERROR:INVALID_LABEL]';
      }
    }
    return data;
  }
}
