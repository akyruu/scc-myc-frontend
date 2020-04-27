import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {Group, Player, Rush} from '../../shared';

export class SessionItem {
  constructor(private _key) {}

  get value(): string {
    return sessionStorage.getItem(this._key);
  }

  next(value: string): void {
    sessionStorage.setItem(this._key, value);
  }
}

@Injectable({providedIn: 'root'})
export class AppContext {
  readonly playerName = new SessionItem('scc-myc-player');
  player: Player;
  rush: Rush;
  readonly group = new BehaviorSubject<Group>(null);
}
