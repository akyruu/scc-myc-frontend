import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import {Player} from '../../../shared';

@Injectable()
export class GroupPlayerResolve implements Resolve<Player> {
  /* METHODS =============================================================== */
  resolve(route: ActivatedRouteSnapshot): Player {
    const group = route.parent.data.group;
    return group.players[+route.params.index];
  }
}
