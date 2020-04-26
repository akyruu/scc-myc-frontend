import {Component} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _domSanitazer: DomSanitizer,
    private _matIconRegistry: MatIconRegistry,
    private _translate: TranslateService
  ) {
    this._initI18n();
    this._initSvgIcons('pickaxe');
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
}
