import {CurrencyPipe} from '@angular/common';
import {Inject, InjectionToken, LOCALE_ID, Pipe} from '@angular/core';

export const DEFAULT_QUANTITY_CODE = new InjectionToken<string>('DEFAULT_QUANTITY_CODE');
export const DEFAULT_QUANTITY_FORMAT = new InjectionToken<string>('DEFAULT_QUANTITY_FORMAT');

@Pipe({name: 'quantity'})
export class QuantityPipe extends CurrencyPipe {
  /* CONSTRUCTOR =========================================================== */
  constructor(
    @Inject(LOCALE_ID) locale: string,
    @Inject(DEFAULT_QUANTITY_CODE) defaultQuantityCode?: string,
    @Inject(DEFAULT_QUANTITY_FORMAT) private _defaultQuantityFormat?: string
  ) {
    super(locale, defaultQuantityCode);
  }

  /* METHODS =============================================================== */
  transform(value: any,
            quantityCode?: string,
            display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean,
            digitsInfo?: string,
            locale?: string): string | null {
    return super.transform(value,
      quantityCode,
      display,
      digitsInfo || this._defaultQuantityFormat,
      locale
    );
  }
}
