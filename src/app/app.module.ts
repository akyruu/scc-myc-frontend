import {registerLocaleData} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import {DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {SocketIoModule} from 'ngx-socket-io';

import {environment} from '../environments/environment';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SharedModule} from './shared';
import {DEFAULT_CURRENCY_FORMAT} from './shared/pipes';

/* FUNCTIONS =============================================================== */
registerLocaleData(localeFr, 'fr');

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

/* MODULE ================================================================== */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    SocketIoModule.forRoot({
      url: environment.socket.url,
      options: {
        autoConnect: true
      }
    }),
    TranslateModule.forRoot({
      loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient]}
    }),
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    {provide: DEFAULT_CURRENCY_CODE, useValue: 'aUEC'},
    {provide: DEFAULT_CURRENCY_FORMAT, useValue: '1.0-0'},
    {provide: LOCALE_ID, useValue: 'fr-FR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
