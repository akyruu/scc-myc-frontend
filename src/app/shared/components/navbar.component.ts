import {Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {MediaObserver} from '@angular/flex-layout';
import {MatDialog} from '@angular/material/dialog';
import {MatSidenav} from '@angular/material/sidenav';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

import {Menu, MenuItem} from '../models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {
  /* FIELDS ================================================================ */
  @Input() title: string;
  @Input() menu: Menu;
  @Input() sidenav: MatSidenav;

  @ContentChild('title') titleRef: TemplateRef<any>;
  @ContentChild('actions') actionsRef: TemplateRef<any>;

  private _isRoom = true;
  private _subscription: Subscription;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _dialog: MatDialog,
    private _mediaObserver: MediaObserver,
    private _translate: TranslateService
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this._subscription = this._mediaObserver.asObservable().subscribe(() =>
      this._isRoom = !this._mediaObserver.isActive('xs'));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  /* View ------------------------------------------------------------------ */
  get items(): MenuItem[] {
    return this.menu.items.filter(item => {
      if (item.visible) {
        if (typeof item.visible === 'function') {
          return item.visible();
        }
        return item.visible;
      }
      return true;
    });
  }

  get actionItems(): MenuItem[] {
    return this.items.filter(item => item.icon
      && (item.showAsAction === 'always'
        || (item.showAsAction === 'ifRoom' && this._isRoom)));
  }

  get otherItems(): MenuItem[] {
    return this.items.filter(item => !item.icon
      || !item.showAsAction
      || item.showAsAction === 'never'
      || (item.showAsAction === 'ifRoom' && !this._isRoom));
  }

  isItemDisabled(item: MenuItem): boolean {
    if (item.disabled !== undefined) {
      if (typeof item.disabled === 'boolean') {
        return item.disabled;
      }
      return item.disabled();
    }
    return false;
  }

  /* Events ---------------------------------------------------------------- */
  onClick(item: MenuItem): void {
    if (item.action) {
      item.action();
    }
  }
}
