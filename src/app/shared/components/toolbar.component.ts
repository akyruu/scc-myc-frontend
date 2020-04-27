import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MediaObserver} from '@angular/flex-layout';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {LobbyGroupSocket} from '../../core/sockets';
import {Menu, MenuItem} from '../models';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html'
})
export class ToolbarComponent implements OnInit, OnDestroy {
  /* FIELDS ================================================================ */
  @Input() menu: Menu;

  private _isRush = true;
  private _subscription: Subscription;

  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _dialog: MatDialog,
    private _mediaObserver: MediaObserver,
    private _translate: TranslateService,
    private _lobbyGroupSocket: LobbyGroupSocket
  ) {}

  /* METHODS =============================================================== */
  ngOnInit(): void {
    this._subscription = this._mediaObserver.asObservable().subscribe(() =>
      this._isRush = !this._mediaObserver.isActive('xs'));
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
        || (item.showAsAction === 'ifRoom' && this._isRush)));
  }

  get otherItems(): MenuItem[] {
    return this.items.filter(item => !item.icon
      || !item.showAsAction
      || item.showAsAction === 'never'
      || (item.showAsAction === 'ifRoom' && !this._isRush));
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
