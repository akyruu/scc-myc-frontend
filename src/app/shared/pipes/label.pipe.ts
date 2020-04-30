import {ChangeDetectorRef, Pipe} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

import {Label} from '../models';

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
  transform(label: Label, locale?: string): any {
    if (label) {
      if (label['key']) {
        return super.transform(label['key'], label['args'], locale);
      } else if (typeof label === 'string' && label.startsWith('@')) {
        return super.transform(label.substring(1));
      }
    }
    return label;
  }
}
