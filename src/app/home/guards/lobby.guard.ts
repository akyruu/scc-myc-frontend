import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

import {AppContext} from '../../core';

@Injectable()
export class LobbyGuard implements CanActivate {
  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _router: Router,
    private _appContext: AppContext,
  ) {}

  /* METHODS =============================================================== */
  canActivate(): boolean {
    if (!this._appContext.player.value || !this._appContext.room.value) {
      this._router.navigate(['/welcome']).then();
      return false;
    }
    return true;
  }
}
