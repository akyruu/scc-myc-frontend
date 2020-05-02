import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import {AppContext} from '../../../core';
import {Player} from '../../../shared';

@Injectable()
export class RushPlayerResolve implements Resolve<Player> {
  /* CONSTRUCTOR =========================================================== */
  constructor(private _appContext: AppContext) {}

  /* METHODS =============================================================== */
  resolve(route: ActivatedRouteSnapshot): Player {
    return this._appContext.rush.players[+route.params.index];
  }
}
