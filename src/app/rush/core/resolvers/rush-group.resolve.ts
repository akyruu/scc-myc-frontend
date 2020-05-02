import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import {AppContext} from '../../../core';
import {Group} from '../../../shared';

@Injectable()
export class RushGroupResolve implements Resolve<Group> {
  /* CONSTRUCTOR =========================================================== */
  constructor(private _appContext: AppContext) {}

  /* METHODS =============================================================== */
  resolve(route: ActivatedRouteSnapshot): Group {
    return this._appContext.rush.groups[+route.params.index];
  }
}
