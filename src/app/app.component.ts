import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DomSanitizer} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {SocketService} from './core/sockets';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  /* FIELDS ================================================================ */
  private readonly _subscriptions: Subscription[] = [];

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _domSanitazer: DomSanitizer,
    private _matIconRegistry: MatIconRegistry,
    private _matSnackBar: MatSnackBar,
    private _translate: TranslateService,
    private _socketService: SocketService
  ) {
    this._initI18n();
    this._initSvgIcons('harvest', 'ore', 'pickaxe');
  }

  /* METHODS =============================================================== */
  private _initI18n(): void {
    this._translate.addLangs(['en', 'fr']);
    this._translate.setDefaultLang('en');

    const browserLang = this._translate.getBrowserLang();
    this._translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

    this._translate.get('app.title').subscribe(title => document.title = title);
  }

  private _initSvgIcons(...icons: string[]): void {
    icons.forEach(icon =>
      this._matIconRegistry.addSvgIcon(icon, this._domSanitazer.bypassSecurityTrustResourceUrl('../assets/images/' + icon + '.svg')));
  }

  ngOnInit(): void {
    this._subscriptions.push(this._socketService.exceptionThrown.subscribe(error => {
      let message = this._translate.instant(error.code, error.data);
      if (message === error.code) {
        message = this._translate.instant('app.socket.error', {code: error.code});
      }
      this._matSnackBar.open(message);
    }));
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
