import {CurrencyPipe as AngularCurrencyPipe} from '@angular/common';
import {DEFAULT_CURRENCY_CODE, Inject, InjectionToken, LOCALE_ID, Pipe} from '@angular/core';

export const DEFAULT_CURRENCY_FORMAT = new InjectionToken<string>('DEFAULT_CURRENCY_FORMAT');

@Pipe({name: 'currency'})
export class CurrencyPipe extends AngularCurrencyPipe {
  /* CONSTRUCTOR =========================================================== */
  constructor(
    @Inject(LOCALE_ID) locale: string,
    @Inject(DEFAULT_CURRENCY_CODE) defaultCurrencyCode?: string,
    @Inject(DEFAULT_CURRENCY_FORMAT) private _defaultCurrencyFormat?: string,
  ) {
    super(locale, defaultCurrencyCode);
  }

  /* METHODS =============================================================== */
  transform(value: any,
            currencyCode?: string,
            display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean,
            digitsInfo?: string,
            locale?: string): string | null {
    return super.transform(value,
      currencyCode,
      display,
      digitsInfo || this._defaultCurrencyFormat,
      locale
    );
  }
}
