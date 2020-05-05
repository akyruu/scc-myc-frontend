import {Injectable} from '@angular/core';
import {CanActivate, CanDeactivate, Router} from '@angular/router';

import {AppContext} from '../../../core';
import {RushService} from '../services';

@Injectable()
export class RushGuard implements CanActivate, CanDeactivate<any> {
  /* CONSTRUCTOR =========================================================== */
  constructor(
    private _router: Router,
    private _appContext: AppContext,
    private _rushService: RushService,
  ) {}

  /* METHODS =============================================================== */
  canActivate(): boolean {
    if (!this._appContext.player || !this._appContext.rush) {
      this._router.navigate(['/welcome']).then();
      return false;
    } else if (!this._appContext.rush.launched) {
      this._router.navigate(['/lobby']).then();
      return false;
    }

    // Socket binding
    if (!this._appContext.rush.single) {
      this._rushService.bindPlayerEvents();
    }
    return true;
  }

  canDeactivate(): boolean {
    // TODO add dialog confirmation, return false if user say "no"

    // Socket unbinding
    if (!this._appContext.rush.single) {
      this._rushService.unbindPlayerEvents();
    }
    return true;
  }
}
