import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {Room, RoomGroup} from '../../shared';

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
  readonly player = new SessionItem('scc-myc-player');
  readonly room = new BehaviorSubject<Room>(null);
  readonly group = new BehaviorSubject<RoomGroup>(null);
}
