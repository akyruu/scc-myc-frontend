import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import {AppContext} from '../../../core';
import {Player} from '../../../shared';

@Injectable()
export class MyPlayerResolve implements Resolve<Player> {
  /* CONSTRUCTOR =========================================================== */
  constructor(private _appContext: AppContext) {}

  /* METHODS =============================================================== */
  resolve(route: ActivatedRouteSnapshot): Player {
    return this._appContext.player;
  }
}
